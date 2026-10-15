/**
 * ICRAST-26 Conference — Dedicated Google Apps Script Backend
 * 
 * Purpose:
 * Receives conference abstract submissions from Science Orbit Forum ICRAST portal,
 * saves attached documents (.docx, .doc, .pdf) to a dedicated Google Drive folder,
 * and logs all abstract submission details into a dedicated Google Spreadsheet.
 */

// =============================================================================
// CONFIGURATION
// Replace the placeholder IDs below with your Google Spreadsheet & Drive Folder IDs
// =============================================================================
const CONFIG = {
  // Dedicated Google Spreadsheet ID (copy from your sheet's browser URL)
  SPREADSHEET_ID: '1lCWbJ3xPXDa04_PRqBdxYZaPrpa4dKGfY2HbI7HlY2E',

  // Sheet tab name inside the spreadsheet
  SHEET_NAME: 'Abstracts',

  // Dedicated Google Drive Folder ID (copy from your folder's browser URL)
  DRIVE_FOLDER_ID: '1Ve4Bf5o_PPEBT6OBL4PSo7qfQhh9B30K',

  // Max document upload limit (15 MB)
  MAX_FILE_SIZE_BYTES: 15 * 1024 * 1024,

  // Allowed file extensions
  ALLOWED_EXTENSIONS: ['pdf', 'doc', 'docx'],
};

/**
 * Reads config with fallback to Script Properties if configured
 */
function getActiveConfig() {
  const props = PropertiesService.getScriptProperties();
  return {
    SPREADSHEET_ID: props.getProperty('SPREADSHEET_ID') || CONFIG.SPREADSHEET_ID,
    SHEET_NAME: props.getProperty('SHEET_NAME') || CONFIG.SHEET_NAME,
    DRIVE_FOLDER_ID: props.getProperty('DRIVE_FOLDER_ID') || CONFIG.DRIVE_FOLDER_ID,
    MAX_FILE_SIZE_BYTES: CONFIG.MAX_FILE_SIZE_BYTES,
  };
}

/**
 * Returns JSON ContentService response with proper MIME type
 */
function jsonResponse(data, statusCode) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

/**
 * Health check endpoint (GET)
 */
function doGet(e) {
  return jsonResponse({
    ok: true,
    service: 'ICRAST-26 Abstract Submission Backend',
    status: 'online',
    timestamp: new Date().toISOString(),
  });
}

function doOptions(e) {
  return jsonResponse({ ok: true });
}

/**
 * Main submission handler (POST)
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  const hasLock = lock.tryLock(30000);
  if (!hasLock) {
    return jsonResponse(
      {
        ok: false,
        error: 'The server is currently busy processing other submissions. Please try again in a few moments.',
      },
      429
    );
  }

  const uploadedFileIds = [];

  try {
    const config = getActiveConfig();

    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ ok: false, error: 'No form payload received.' });
    }

    let payload;
    try {
      payload = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      return jsonResponse({ ok: false, error: 'Invalid JSON payload received.' });
    }

    // =========================================================================
    // VALIDATION
    // =========================================================================
    const validationErrors = [];

    // Section I: Author Information
    const author = payload.presentingAuthor || {};
    if (!author.fullName || !author.fullName.trim()) validationErrors.push('Presenting author full name is required.');
    if (!author.email || !isValidEmail(author.email)) validationErrors.push('A valid email address is required.');
    if (!author.phone || !author.phone.trim()) validationErrors.push('Contact number is required.');
    if (!author.affiliation || !author.affiliation.trim()) validationErrors.push('Institutional affiliation is required.');
    if (!author.department || !author.department.trim()) validationErrors.push('Department is required.');
    if (!author.designationStatus || !author.designationStatus.trim()) validationErrors.push('Designation/status is required.');
    if (!author.country || !author.country.trim()) validationErrors.push('Country is required.');
    if (!author.state || !author.state.trim()) validationErrors.push('State is required.');
    if (!author.city || !author.city.trim()) validationErrors.push('City is required.');

    // Section III: Abstract Information
    const abstractInfo = payload.abstractInfo || {};
    if (!abstractInfo.paperTitle || !abstractInfo.paperTitle.trim()) validationErrors.push('Title of the research paper is required.');
    if (!abstractInfo.abstractText || !abstractInfo.abstractText.trim()) validationErrors.push('Abstract text is required.');
    if (!abstractInfo.keywords || !abstractInfo.keywords.trim()) validationErrors.push('Keywords are required.');
    if (!abstractInfo.researchArea || !abstractInfo.researchArea.trim()) validationErrors.push('Research area is required.');
    if (!abstractInfo.typeOfResearch || !abstractInfo.typeOfResearch.trim()) validationErrors.push('Type of research is required.');

    // Section V: Preferences
    const preferences = payload.preferences || {};
    if (!preferences.presentationCategory) validationErrors.push('Please select a presentation category.');
    if (!preferences.presentationMode) validationErrors.push('Please select a presentation mode.');
    if (preferences.guidelineAgreement !== true) validationErrors.push('Agreement to presentation guidelines is required.');

    // Section VI: Ethics
    const ethics = payload.ethics || {};
    if (ethics.originality !== true || ethics.plagiarism !== true || ethics.authorship !== true) {
      validationErrors.push('Please confirm the Research Ethics, Originality, and Authorship declarations.');
    }

    // Section VIII: Final Confirmation
    const confirmation = payload.confirmation || {};
    if (
      confirmation.accurateInfo !== true ||
      confirmation.noGuarantee !== true ||
      confirmation.subjectToConfirmation !== true ||
      confirmation.followInstructions !== true
    ) {
      validationErrors.push('All Final Confirmation checkboxes must be acknowledged before submitting.');
    }

    if (validationErrors.length > 0) {
      return jsonResponse({
        ok: false,
        error: 'Validation failed.',
        details: validationErrors,
      });
    }

    // =========================================================================
    // GOOGLE DRIVE UPLOAD
    // =========================================================================
    let folder;
    try {
      folder = DriveApp.getFolderById(config.DRIVE_FOLDER_ID);
    } catch (folderErr) {
      return jsonResponse({
        ok: false,
        error: 'Drive folder destination is unavailable. Please verify DRIVE_FOLDER_ID in the script.',
      });
    }

    const reference = 'ICRAST-' + generateRandomCode(8);
    const submissionTime = new Date();
    const formattedTimestamp = Utilities.formatDate(
      submissionTime,
      Session.getScriptTimeZone() || 'Asia/Kolkata',
      'yyyy-MM-dd HH:mm:ss'
    );

    const files = payload.files || {};
    let editableDocLink = 'Not uploaded';
    let pdfDocLink = 'Not uploaded';

    if (files.editableDoc && files.editableDoc.base64Data) {
      const editRes = saveBase64Document(folder, files.editableDoc, reference, 'EditableDoc', config);
      if (!editRes.ok) return jsonResponse({ ok: false, error: editRes.error });
      editableDocLink = editRes.fileUrl;
      uploadedFileIds.push(editRes.fileId);
    }

    if (files.pdfDoc && files.pdfDoc.base64Data) {
      const pdfRes = saveBase64Document(folder, files.pdfDoc, reference, 'PDF_Doc', config);
      if (!pdfRes.ok) {
        rollbackFiles(uploadedFileIds);
        return jsonResponse({ ok: false, error: pdfRes.error });
      }
      pdfDocLink = pdfRes.fileUrl;
      uploadedFileIds.push(pdfRes.fileId);
    }

    // =========================================================================
    // GOOGLE SPREADSHEET LOGGING
    // =========================================================================
    let spreadsheet;
    try {
      spreadsheet = SpreadsheetApp.openById(config.SPREADSHEET_ID);
    } catch (sheetErr) {
      rollbackFiles(uploadedFileIds);
      return jsonResponse({
        ok: false,
        error: 'Google Spreadsheet could not be opened. Please verify SPREADSHEET_ID in the script.',
      });
    }

    let sheet = spreadsheet.getSheetByName(config.SHEET_NAME);
    if (!sheet) {
      sheet = spreadsheet.insertSheet(config.SHEET_NAME);
      initializeHeaders(sheet);
    } else if (sheet.getLastRow() === 0) {
      initializeHeaders(sheet);
    }

    // Format Co-Authors
    const coAuthors = Array.isArray(payload.coAuthors) ? payload.coAuthors : [];
    const coAuthorsFormatted = coAuthors.map(function(ca, i) {
      return (i + 1) + '. ' + ca.fullName + ' (' + ca.gender + ', ' + ca.designationStatus + ', ' + ca.department + ', ' + ca.affiliation + ', ' + ca.email + ')';
    }).join('\n');

    const rowData = [
      formattedTimestamp,                                  // A: Timestamp
      reference,                                           // B: Reference ID (ICRAST-XXXXXXXX)
      'Received',                                          // C: Review Status
      author.fullName.trim(),                              // D: Presenting Author Name
      author.gender || 'Not specified',                    // E: Gender
      author.email.trim(),                                 // F: Email
      author.phone.trim(),                                 // G: Contact Number
      author.affiliation.trim(),                          // H: Affiliation
      author.department.trim(),                           // I: Department
      author.designationStatus.trim(),                    // J: Designation / Status
      author.country.trim(),                              // K: Country
      author.state.trim(),                                // L: State
      author.city.trim(),                                 // M: City
      coAuthors.length,                                    // N: Total Co-Authors
      coAuthorsFormatted || 'None',                        // O: Co-Authors Details
      abstractInfo.paperTitle.trim(),                      // P: Paper Title
      abstractInfo.researchArea.trim(),                    // Q: Research Area
      abstractInfo.subfield.trim() || 'N/A',               // R: Subfield / Specialisation
      abstractInfo.typeOfResearch.trim(),                  // S: Type of Research
      abstractInfo.keywords.trim(),                        // T: Keywords
      abstractInfo.abstractText.trim(),                    // U: Abstract Text
      editableDocLink,                                     // V: Editable Document (.docx/.doc) Link
      pdfDocLink,                                          // W: PDF Document Link
      preferences.presentationCategory,                    // X: Presentation Category
      preferences.presentationMode,                        // Y: Presentation Mode
      'Agreed',                                            // Z: Guidelines Agreement
      'Confirmed',                                         // AA: Research Ethics & Originality
      'Confirmed'                                          // AB: Final Confirmation
    ];

    sheet.appendRow(rowData);

    return jsonResponse({
      ok: true,
      reference: reference,
      timestamp: formattedTimestamp,
      title: abstractInfo.paperTitle.trim(),
      category: preferences.presentationCategory,
      mode: preferences.presentationMode,
      message: 'Your abstract has been successfully submitted to ICRAST-26.',
    });

  } catch (error) {
    rollbackFiles(uploadedFileIds);
    return jsonResponse({
      ok: false,
      error: 'An unexpected server error occurred: ' + error.toString(),
    });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Saves Base64 file directly to Google Drive
 */
function saveBase64Document(folder, docData, reference, docTypeLabel, config) {
  try {
    if (!docData.base64Data || !docData.filename) {
      return { ok: false, error: 'Incomplete document data received.' };
    }

    const originalName = docData.filename.replace(/[^\w\.\-\s]/gi, '_');
    const extMatch = originalName.match(/\.([0-9a-z]+)$/i);
    const extension = extMatch ? extMatch[1].toLowerCase() : 'dat';

    const mimeType = (docData.mimeType || '').toLowerCase();
    let cleanBase64 = docData.base64Data;
    const commaIndex = cleanBase64.indexOf(',');
    if (commaIndex !== -1) {
      cleanBase64 = cleanBase64.substring(commaIndex + 1);
    }

    const decodedBytes = Utilities.base64Decode(cleanBase64);
    if (decodedBytes.length > config.MAX_FILE_SIZE_BYTES) {
      return {
        ok: false,
        error: docTypeLabel + ' exceeds maximum permitted size of 15 MB.',
      };
    }

    const fileName = reference + '_' + docTypeLabel + '.' + extension;
    const blob = Utilities.newBlob(decodedBytes, mimeType, fileName);

    const file = folder.createFile(blob);
    file.setDescription('ICRAST-26 Document for ' + reference + ' (' + docTypeLabel + ')');

    return {
      ok: true,
      fileId: file.getId(),
      fileUrl: file.getUrl(),
    };
  } catch (err) {
    return {
      ok: false,
      error: 'Failed to securely store ' + docTypeLabel + ': ' + err.toString(),
    };
  }
}

/**
 * Deletes uploaded files if sheet logging fails
 */
function rollbackFiles(fileIds) {
  if (!fileIds || !fileIds.length) return;
  fileIds.forEach(function (id) {
    try {
      const file = DriveApp.getFileById(id);
      file.setTrashed(true);
    } catch (e) {}
  });
}

function generateRandomCode(length) {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let randStr = '';
  for (let i = 0; i < length; i++) {
    const idx = Math.floor(Math.random() * chars.length);
    randStr += chars.charAt(idx);
  }
  return randStr;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Sets up styled headers on the Google Sheet
 */
function initializeHeaders(sheet) {
  const headers = [
    'Submission Timestamp',
    'Abstract Reference ID',
    'Review Status',
    'Presenting Author Name',
    'Gender',
    'Email Address',
    'Contact Number',
    'Affiliation / University',
    'Department',
    'Designation / Status',
    'Country',
    'State',
    'City',
    'Co-Author Count',
    'Co-Author Details',
    'Paper Title',
    'Research Area',
    'Subfield / Specialisation',
    'Type of Research',
    'Keywords',
    'Abstract Text',
    'Editable Doc (.docx/.doc) Drive Link',
    'PDF Doc Drive Link',
    'Presentation Category',
    'Presentation Mode',
    'Guidelines Agreement',
    'Ethics & Originality',
    'Final Confirmation'
  ];
  sheet.appendRow(headers);
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#A31D1D'); // ICRAST Crimson header
  headerRange.setFontColor('#FFFFFF');
  sheet.setFrozenRows(1);
}
