/**
 * ICRAST-26 Conference — Dedicated Google Apps Script Backend
 * 
 * Setup Instructions:
 * 1. Open your Google Sheet (with tab named 'Abstract' or 'Abstracts').
 * 2. Go to Extensions -> Apps Script.
 * 3. Delete everything in the editor, paste this entire code, and Save (Ctrl+S).
 * 4. Click Deploy -> New deployment -> Select 'Web app'.
 *    - Execute as: 'Me'
 *    - Who has access: 'Anyone'
 * 5. Copy the Web app URL and use it in your website.
 */

// =============================================================================
// CONFIGURATION
// =============================================================================
const CONFIG = {
  // If attached to your Google Sheet (Extensions -> Apps Script), this auto-detects.
  // Otherwise, paste your spreadsheet ID here if using a standalone script.
  SPREADSHEET_ID: '',

  // Primary tab name in your spreadsheet
  SHEET_NAME: 'Abstract',

  // Google Drive folder ID for uploads (Optional: if empty, auto-creates 'ICRAST-26 Abstract Uploads' in your Drive)
  DRIVE_FOLDER_ID: '',

  // Max document upload limit (15 MB)
  MAX_FILE_SIZE_BYTES: 15 * 1024 * 1024,
};

function getActiveConfig() {
  const props = PropertiesService.getScriptProperties();
  return {
    SPREADSHEET_ID: props.getProperty('SPREADSHEET_ID') || CONFIG.SPREADSHEET_ID,
    SHEET_NAME: props.getProperty('SHEET_NAME') || CONFIG.SHEET_NAME,
    DRIVE_FOLDER_ID: props.getProperty('DRIVE_FOLDER_ID') || CONFIG.DRIVE_FOLDER_ID,
    MAX_FILE_SIZE_BYTES: CONFIG.MAX_FILE_SIZE_BYTES,
  };
}

function jsonResponse(data) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

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

function doPost(e) {
  const lock = LockService.getScriptLock();
  const hasLock = lock.tryLock(30000);
  if (!hasLock) {
    return jsonResponse({
      ok: false,
      error: 'The server is currently busy processing other submissions. Please try again in a few moments.',
    });
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

    const abstractInfo = payload.abstractInfo || {};
    if (!abstractInfo.paperTitle || !abstractInfo.paperTitle.trim()) validationErrors.push('Title of the research paper is required.');
    if (!abstractInfo.abstractText || !abstractInfo.abstractText.trim()) validationErrors.push('Abstract text is required.');
    if (!abstractInfo.keywords || !abstractInfo.keywords.trim()) validationErrors.push('Keywords are required.');
    if (!abstractInfo.researchArea || !abstractInfo.researchArea.trim()) validationErrors.push('Research area is required.');

    const preferences = payload.preferences || {};
    if (!preferences.presentationCategory) validationErrors.push('Please select a presentation category.');
    if (!preferences.presentationMode) validationErrors.push('Please select a presentation mode.');

    if (validationErrors.length > 0) {
      return jsonResponse({
        ok: false,
        error: 'Validation failed.',
        details: validationErrors,
      });
    }

    // =========================================================================
    // GOOGLE DRIVE DESTINATION
    // =========================================================================
    let folder = null;
    if (config.DRIVE_FOLDER_ID && config.DRIVE_FOLDER_ID.trim()) {
      try {
        folder = DriveApp.getFolderById(config.DRIVE_FOLDER_ID.trim());
      } catch (err) {}
    }

    // Auto-create/find folder in root Drive if not configured
    if (!folder) {
      const existing = DriveApp.getFoldersByName('ICRAST-26 Abstract Uploads');
      if (existing.hasNext()) {
        folder = existing.next();
      } else {
        folder = DriveApp.createFolder('ICRAST-26 Abstract Uploads');
      }
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
    // GOOGLE SPREADSHEET DESTINATION
    // =========================================================================
    let spreadsheet = null;
    try {
      spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    } catch (e) {}

    if (!spreadsheet && config.SPREADSHEET_ID && config.SPREADSHEET_ID.trim()) {
      try {
        spreadsheet = SpreadsheetApp.openById(config.SPREADSHEET_ID.trim());
      } catch (sheetErr) {}
    }

    if (!spreadsheet) {
      rollbackFiles(uploadedFileIds);
      return jsonResponse({
        ok: false,
        error: 'Could not connect to Google Spreadsheet. Please make sure this script is opened from Extensions -> Apps Script inside your sheet.',
      });
    }

    // Find tab: checks 'Abstract', 'Abstracts', or the active sheet
    let sheet = spreadsheet.getSheetByName('Abstract') ||
                spreadsheet.getSheetByName('Abstracts') ||
                spreadsheet.getSheetByName(config.SHEET_NAME) ||
                spreadsheet.getSheets()[0];

    if (!sheet) {
      sheet = spreadsheet.insertSheet('Abstract');
      initializeHeaders(sheet);
    } else if (sheet.getLastRow() === 0) {
      initializeHeaders(sheet);
    }

    // Co-Authors formatting
    const coAuthors = Array.isArray(payload.coAuthors) ? payload.coAuthors : [];
    const coAuthorsFormatted = coAuthors.map(function(ca, i) {
      return (i + 1) + '. ' + (ca.fullName || '') + ' (' + (ca.gender || '') + ', ' + (ca.designationStatus || '') + ', ' + (ca.department || '') + ', ' + (ca.affiliation || '') + ', ' + (ca.email || '') + ')';
    }).join('\n');

    const rowData = [
      formattedTimestamp,                                  // A: Timestamp
      reference,                                           // B: Reference ID (ICRAST-XXXXXXXX)
      'Received',                                          // C: Review Status
      author.fullName.trim(),                              // D: Presenting Author Name
      author.gender || 'Not specified',                    // E: Gender
      author.email.trim(),                                 // F: Email Address
      author.phone.trim(),                                 // G: Contact Number
      author.affiliation.trim(),                          // H: Affiliation / University
      author.department.trim(),                           // I: Department
      author.designationStatus.trim(),                    // J: Designation / Status
      author.country.trim(),                              // K: Country
      author.state.trim(),                                // L: State
      author.city.trim(),                                 // M: City
      coAuthors.length,                                    // N: Co-Author Count
      coAuthorsFormatted || 'None',                        // O: Co-Author Details
      abstractInfo.paperTitle.trim(),                      // P: Paper Title
      abstractInfo.researchArea.trim(),                    // Q: Research Area
      (abstractInfo.subfield || '').trim() || 'N/A',       // R: Subfield / Specialisation
      (abstractInfo.typeOfResearch || '').trim() || 'N/A', // S: Type of Research
      abstractInfo.keywords.trim(),                        // T: Keywords
      abstractInfo.abstractText.trim(),                    // U: Abstract Text
      editableDocLink,                                     // V: Editable Document Link
      pdfDocLink,                                          // W: PDF Document Link
      preferences.presentationCategory || 'Oral Presentation', // X: Presentation Category
      preferences.presentationMode || 'On-site presentation', // Y: Presentation Mode
      'Agreed',                                            // Z: Guidelines Agreement
      'Confirmed',                                         // AA: Ethics & Originality
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
      error: 'Server error: ' + error.toString(),
    });
  } finally {
    lock.releaseLock();
  }
}

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
      error: 'Failed to store ' + docTypeLabel + ': ' + err.toString(),
    };
  }
}

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
