/**
 * Science Orbit Forum (SOF) Backend — Google Apps Script Handler
 * Handles:
 * 1. Science Orbit Individual Membership Applications -> 'Applications' sheet
 * 2. ICRAST-26 Abstract Submissions -> 'ICRAST_Abstracts' sheet
 *
 * Saves documents securely to private Google Drive folder with zero public links.
 */

const CONFIG = {
  // Google Spreadsheet ID
  SPREADSHEET_ID: '130PtbirPJPA2KKqQSyg5FyYVhBauPp-RRL13fTK_obg',
  // Membership worksheet
  MEMBERSHIP_SHEET: 'Applications',
  // ICRAST worksheet
  ICRAST_SHEET: 'ICRAST_Abstracts',
  // Private Google Drive Folder ID
  DRIVE_FOLDER_ID: '16lTwbypKE--jQebPSrGQAb_ChOa4VyFd',
  // Document limits
  MAX_FILE_SIZE_BYTES: 15 * 1024 * 1024, // 15 MB
  ALLOWED_MIME_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/jpg',
  ],
  // Category pricing map (Server-authoritative)
  CATEGORY_FEES: {
    platinum: { title: 'Platinum', fee: '₹10,000 / year', feeAmount: 10000 },
    gold: { title: 'Gold', fee: '₹5,000 / year', feeAmount: 5000 },
    silver: { title: 'Silver', fee: '₹1,000 / year', feeAmount: 1000 },
  },
};

function getActiveConfig() {
  const props = PropertiesService.getScriptProperties();
  return {
    SPREADSHEET_ID: props.getProperty('SPREADSHEET_ID') || CONFIG.SPREADSHEET_ID,
    MEMBERSHIP_SHEET: props.getProperty('MEMBERSHIP_SHEET') || CONFIG.MEMBERSHIP_SHEET,
    ICRAST_SHEET: props.getProperty('ICRAST_SHEET') || CONFIG.ICRAST_SHEET,
    DRIVE_FOLDER_ID: props.getProperty('DRIVE_FOLDER_ID') || CONFIG.DRIVE_FOLDER_ID,
    MAX_FILE_SIZE_BYTES: CONFIG.MAX_FILE_SIZE_BYTES,
    ALLOWED_MIME_TYPES: CONFIG.ALLOWED_MIME_TYPES,
    CATEGORY_FEES: CONFIG.CATEGORY_FEES,
  };
}

function jsonResponse(data, statusCode) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

function doGet(e) {
  return jsonResponse({
    ok: true,
    service: 'Science Orbit Forum Unified API (Membership + ICRAST-26)',
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

    // ==========================================
    // ROUTE BASED ON FORM TYPE
    // ==========================================
    if (payload.formType === 'icrast_abstract') {
      return handleIcrastSubmission(payload, config, uploadedFileIds);
    } else {
      return handleMembershipSubmission(payload, config, uploadedFileIds);
    }
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
 * Handle ICRAST-26 Abstract Submissions with All 8 Sections
 */
function handleIcrastSubmission(payload, config, uploadedFileIds) {
  const validationErrors = [];

  // Section I Validation
  const author = payload.presentingAuthor || {};
  if (!author.fullName || !author.fullName.trim()) validationErrors.push('Presenting author full name is required.');
  if (!author.email || !isValidEmail(author.email)) validationErrors.push('A valid email address is required.');
  if (!author.phone || !author.phone.trim()) validationErrors.push('Contact number with country code is required.');
  if (!author.affiliation || !author.affiliation.trim()) validationErrors.push('Institutional affiliation is required.');
  if (!author.department || !author.department.trim()) validationErrors.push('Department is required.');
  if (!author.designationStatus || !author.designationStatus.trim()) validationErrors.push('Designation / status is required.');
  if (!author.country || !author.country.trim()) validationErrors.push('Country is required.');
  if (!author.state || !author.state.trim()) validationErrors.push('State is required.');
  if (!author.city || !author.city.trim()) validationErrors.push('City is required.');

  // Section III Validation
  const abstractInfo = payload.abstractInfo || {};
  if (!abstractInfo.paperTitle || !abstractInfo.paperTitle.trim()) validationErrors.push('Title of the research paper is required.');
  if (!abstractInfo.abstractText || !abstractInfo.abstractText.trim()) validationErrors.push('Abstract text is required.');
  if (!abstractInfo.keywords || !abstractInfo.keywords.trim()) validationErrors.push('Keywords are required.');
  if (!abstractInfo.researchArea || !abstractInfo.researchArea.trim()) validationErrors.push('Research area is required.');
  if (!abstractInfo.typeOfResearch || !abstractInfo.typeOfResearch.trim()) validationErrors.push('Type of research is required.');

  // Section V Validation
  const preferences = payload.preferences || {};
  if (!preferences.presentationCategory) validationErrors.push('Please select a preferred presentation category.');
  if (!preferences.presentationMode) validationErrors.push('Please select a preferred presentation mode.');
  if (preferences.guidelineAgreement !== true) validationErrors.push('Agreement to presentation guidelines is required.');

  // Section VI Validation
  const ethics = payload.ethics || {};
  if (ethics.originality !== true || ethics.plagiarism !== true || ethics.authorship !== true) {
    validationErrors.push('Please accept the Research Ethics, Originality, and Authorship declarations.');
  }

  // Section VIII Validation
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

  let folder;
  try {
    folder = DriveApp.getFolderById(config.DRIVE_FOLDER_ID);
  } catch (folderErr) {
    return jsonResponse({
      ok: false,
      error: 'Server configuration error: Drive folder destination is unavailable.',
    });
  }

  const reference = 'ICRAST-' + generateRandomCode(8);
  const submissionTime = new Date();
  const formattedTimestamp = Utilities.formatDate(
    submissionTime,
    Session.getScriptTimeZone() || 'Asia/Kolkata',
    'yyyy-MM-dd HH:mm:ss'
  );

  // Handle Section IV Documents Upload
  const files = payload.files || {};
  let editableDocId = 'Not uploaded';
  let pdfDocId = 'Not uploaded';

  if (files.editableDoc && files.editableDoc.base64Data) {
    const editRes = saveBase64Document(folder, files.editableDoc, reference, 'EditableDoc', config);
    if (!editRes.ok) return jsonResponse({ ok: false, error: editRes.error });
    editableDocId = editRes.fileId;
    uploadedFileIds.push(editRes.fileId);
  }

  if (files.pdfDoc && files.pdfDoc.base64Data) {
    const pdfRes = saveBase64Document(folder, files.pdfDoc, reference, 'PDF_Doc', config);
    if (!pdfRes.ok) {
      rollbackFiles(uploadedFileIds);
      return jsonResponse({ ok: false, error: pdfRes.error });
    }
    pdfDocId = pdfRes.fileId;
    uploadedFileIds.push(pdfRes.fileId);
  }

  let spreadsheet;
  try {
    spreadsheet = SpreadsheetApp.openById(config.SPREADSHEET_ID);
  } catch (sheetErr) {
    rollbackFiles(uploadedFileIds);
    return jsonResponse({
      ok: false,
      error: 'Server configuration error: Google Spreadsheet could not be opened.',
    });
  }

  let sheet = spreadsheet.getSheetByName(config.ICRAST_SHEET);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(config.ICRAST_SHEET);
    initializeIcrastHeaders(sheet);
  } else if (sheet.getLastRow() === 0) {
    initializeIcrastHeaders(sheet);
  }

  // Format Co-Authors
  const coAuthors = Array.isArray(payload.coAuthors) ? payload.coAuthors : [];
  const coAuthorsFormatted = coAuthors.map(function(ca, i) {
    return (i + 1) + '. ' + ca.fullName + ' (' + ca.gender + ', ' + ca.designationStatus + ', ' + ca.department + ', ' + ca.affiliation + ', ' + ca.email + ')';
  }).join('\n');

  const rowData = [
    formattedTimestamp,                                  // A: Timestamp
    reference,                                           // B: Abstract Reference (ICRAST-XXXXXXXX)
    'Received',                                          // C: Status
    author.fullName.trim(),                              // D: Presenting Author
    author.gender || 'Not specified',                    // E: Gender
    author.email.trim(),                                 // F: Email
    author.phone.trim(),                                 // G: Contact Number
    author.affiliation.trim(),                          // H: Affiliation
    author.department.trim(),                           // I: Department
    author.designationStatus.trim(),                    // J: Designation/Status
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
    editableDocId,                                       // V: Editable Document Drive File ID
    pdfDocId,                                            // W: PDF Document Drive File ID
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
}

/**
 * Handle Membership Submissions
 */
function handleMembershipSubmission(payload, config, uploadedFileIds) {
  const validationErrors = [];

  if (!payload.fullName || typeof payload.fullName !== 'string' || !payload.fullName.trim()) {
    validationErrors.push('Full name is required.');
  }
  if (!payload.dob || typeof payload.dob !== 'string' || !payload.dob.trim()) {
    validationErrors.push('Date of birth is required.');
  }
  if (!payload.email || typeof payload.email !== 'string' || !isValidEmail(payload.email)) {
    validationErrors.push('A valid email address is required.');
  }
  if (!payload.phone || typeof payload.phone !== 'string' || !payload.phone.trim()) {
    validationErrors.push('Mobile number is required.');
  }
  if (!payload.postalAddress || typeof payload.postalAddress !== 'string' || !payload.postalAddress.trim()) {
    validationErrors.push('Postal address is required.');
  }
  if (!payload.cityDistrictState || typeof payload.cityDistrictState !== 'string' || !payload.cityDistrictState.trim()) {
    validationErrors.push('City / District / State is required.');
  }
  if (!payload.country || typeof payload.country !== 'string' || !payload.country.trim()) {
    validationErrors.push('Country is required.');
  }
  if (!payload.preferredCommunication || !['Email', 'Mobile / WhatsApp', 'Both'].includes(payload.preferredCommunication)) {
    validationErrors.push('Preferred communication method is required.');
  }
  if (!payload.qualificationStatus || typeof payload.qualificationStatus !== 'string' || !payload.qualificationStatus.trim()) {
    validationErrors.push('Academic qualification / professional status is required.');
  }
  if (!payload.scientificInterests || typeof payload.scientificInterests !== 'string' || !payload.scientificInterests.trim()) {
    validationErrors.push('Area(s) of scientific interest is required.');
  }

  const permittedCategories = Object.keys(config.CATEGORY_FEES);
  if (!payload.category || !permittedCategories.includes(payload.category)) {
    validationErrors.push('Please select a valid membership category (Platinum, Gold, or Silver).');
  }
  if (!payload.requestedStartDate || typeof payload.requestedStartDate !== 'string' || !payload.requestedStartDate.trim()) {
    validationErrors.push('Requested membership start date is required.');
  }
  if (!payload.memberStatus || !['new', 'renewal'].includes(payload.memberStatus)) {
    validationErrors.push('Please specify renewal or new member status.');
  }
  if (!Array.isArray(payload.participationInterests) || payload.participationInterests.length === 0) {
    validationErrors.push('Please select at least one participation interest.');
  }
  if (!payload.contributionStatement || typeof payload.contributionStatement !== 'string' || !payload.contributionStatement.trim()) {
    validationErrors.push('Contribution statement is required.');
  }
  if (!payload.proofOfIdentity || !payload.proofOfIdentity.base64Data || !payload.proofOfIdentity.filename) {
    validationErrors.push('Proof of identity document is required.');
  }
  if (!payload.institutionalId || !payload.institutionalId.base64Data || !payload.institutionalId.filename) {
    validationErrors.push('Student / institutional ID document is required.');
  }
  if (payload.consent !== true) {
    validationErrors.push('You must accept the Declaration and Consent before submitting.');
  }

  if (validationErrors.length > 0) {
    return jsonResponse({
      ok: false,
      error: 'Validation failed.',
      details: validationErrors,
    });
  }

  const categoryInfo = config.CATEGORY_FEES[payload.category];
  const categoryTitle = categoryInfo.title;
  const annualFee = categoryInfo.fee;
  const applicationStatus = 'Pending';

  let folder;
  try {
    folder = DriveApp.getFolderById(config.DRIVE_FOLDER_ID);
  } catch (folderErr) {
    return jsonResponse({
      ok: false,
      error: 'Server configuration error: Document storage destination is unavailable.',
    });
  }

  const reference = 'SOF-' + generateRandomCode(8);
  const submissionTime = new Date();
  const formattedTimestamp = Utilities.formatDate(
    submissionTime,
    Session.getScriptTimeZone() || 'Asia/Kolkata',
    'yyyy-MM-dd HH:mm:ss'
  );

  const idFileResult = saveBase64Document(
    folder,
    payload.proofOfIdentity,
    reference,
    'ProofOfIdentity',
    config
  );
  if (!idFileResult.ok) {
    return jsonResponse({ ok: false, error: idFileResult.error });
  }
  uploadedFileIds.push(idFileResult.fileId);

  const instIdResult = saveBase64Document(
    folder,
    payload.institutionalId,
    reference,
    'InstitutionalID',
    config
  );
  if (!instIdResult.ok) {
    rollbackFiles(uploadedFileIds);
    return jsonResponse({ ok: false, error: instIdResult.error });
  }
  uploadedFileIds.push(instIdResult.fileId);

  let spreadsheet;
  try {
    spreadsheet = SpreadsheetApp.openById(config.SPREADSHEET_ID);
  } catch (sheetErr) {
    rollbackFiles(uploadedFileIds);
    return jsonResponse({
      ok: false,
      error: 'Server configuration error: Database spreadsheet could not be opened.',
    });
  }

  let sheet = spreadsheet.getSheetByName(config.MEMBERSHIP_SHEET);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(config.MEMBERSHIP_SHEET);
    initializeMembershipHeaders(sheet);
  } else if (sheet.getLastRow() === 0) {
    initializeMembershipHeaders(sheet);
  }

  let interestsList = payload.participationInterests.join(', ');
  if (payload.otherInterestText && payload.otherInterestText.trim()) {
    interestsList += ' (Other: ' + payload.otherInterestText.trim() + ')';
  }

  const rowData = [
    formattedTimestamp,
    reference,
    applicationStatus,
    categoryTitle,
    annualFee,
    payload.fullName.trim(),
    payload.dob.trim(),
    payload.email.trim(),
    payload.phone.trim(),
    payload.preferredCommunication,
    payload.postalAddress.trim(),
    payload.cityDistrictState.trim(),
    payload.country.trim(),
    (payload.institution || '').trim(),
    (payload.designationCourse || '').trim(),
    payload.qualificationStatus.trim(),
    payload.scientificInterests.trim(),
    payload.requestedStartDate.trim(),
    payload.memberStatus === 'renewal' ? 'Renewal' : 'New Member',
    interestsList,
    payload.contributionStatement.trim(),
    idFileResult.fileId,
    instIdResult.fileId,
    'Agreed'
  ];

  sheet.appendRow(rowData);

  return jsonResponse({
    ok: true,
    reference: reference,
    timestamp: formattedTimestamp,
    categoryTitle: categoryTitle,
    annualFee: annualFee,
    message: 'Your application has been received successfully.',
  });
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
    file.setDescription('Document for ' + reference + ' (' + docTypeLabel + ')');

    return {
      ok: true,
      fileId: file.getId(),
    };
  } catch (err) {
    return {
      ok: false,
      error: 'Failed to securely store ' + docTypeLabel + ': ' + err.toString(),
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

function initializeMembershipHeaders(sheet) {
  const headers = [
    'Timestamp',
    'Reference ID',
    'Status',
    'Category',
    'Annual Fee',
    'Full Name',
    'Date of Birth',
    'Email Address',
    'Mobile Number',
    'Preferred Communication',
    'Postal Address',
    'City / District / State',
    'Country',
    'Institution / Organisation',
    'Designation / Course',
    'Academic / Professional Qualification',
    'Scientific Interests',
    'Requested Start Date',
    'Member Status',
    'Participation Interests',
    'Contribution Statement',
    'Proof of Identity File ID',
    'Institutional ID File ID',
    'Declaration & Consent'
  ];
  sheet.appendRow(headers);
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#0B1B33');
  headerRange.setFontColor('#FFFFFF');
  sheet.setFrozenRows(1);
}

function initializeIcrastHeaders(sheet) {
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
    'Editable Doc Drive File ID',
    'PDF Doc Drive File ID',
    'Presentation Category',
    'Presentation Mode',
    'Guidelines Agreement',
    'Ethics & Originality',
    'Final Confirmation'
  ];
  sheet.appendRow(headers);
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#F51616');
  headerRange.setFontColor('#FFFFFF');
  sheet.setFrozenRows(1);
}
