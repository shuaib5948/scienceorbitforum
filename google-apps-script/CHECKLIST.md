# Science Orbit Forum — Membership System Verification & Checklist

This document details the test scenarios, validation matrix, and security review for the **Individual Membership Application Form** and its Google Apps Script / Sheets / Drive integration.

---

## 1. Submission Flow & Functionality Checklist

| # | Test Scenario | Expected Outcome | Status |
|---|---|---|---|
| 1 | **Initial Page Load (`/join/apply`)** | Form renders all 5 sections cleanly, loads default category or pre-selected query param (`?category=gold`). | Verified |
| 2 | **Category Selection & Fee Display** | Selecting Platinum shows ₹10,000/yr, Gold shows ₹5,000/yr, Silver shows ₹1,000/yr. Updates eligibility summary dynamically. | Verified |
| 3 | **Mandatory Client-Side Validation** | Leaving required fields blank triggers inline visual warnings and prevents network request. | Verified |
| 4 | **Document File Size Check (> 5 MB)** | Selecting a file larger than 5 MB immediately flags an error: *"File exceeds maximum allowed size of 5 MB"*, clearing invalid file. | Verified |
| 5 | **Document MIME Type Check** | Uploading disallowed formats (e.g., `.exe`, `.zip`, `.docx`) triggers *"Invalid file format. Please upload PDF, JPG, or PNG."* | Verified |
| 6 | **Document Replacement & Removal** | Applicant can replace or clear selected files; filename and file size in KB/MB display accurately. | Verified |
| 7 | **Multi-Select Interests & "Other" Field** | Applicants can select multiple checkboxes. Choosing "Other" toggles a dedicated text input for custom interest. | Verified |
| 8 | **Declaration Checkbox Enforcement** | Submit button blocked / form invalid if Declaration & Consent checkbox is not accepted. | Verified |
| 9 | **Double-Click & Concurrent Submit Prevention** | Submit button shows loading spinner, text becomes "Submitting Application...", and button is strictly disabled during in-flight network call. | Verified |
| 10 | **Server Confirmation & Reference ID** | Form displays success state only after server returns `ok: true`. Shows unique reference ID `SOF-XXXXXXXX`, timestamp, category, and fee. | Verified |
| 11 | **Form State Reset** | Form state is cleared upon successful submission; provides link back to `/join` Membership Hub or to submit another application. | Verified |
| 12 | **Network Error / Service Unavailable** | Gracefully displays error banner with option to retry without losing previously filled form fields. | Verified |

---

## 2. Google Apps Script & Storage Verification

| Component | Target Location | Security & Integrity Control |
|---|---|---|
| **Form Endpoint** | Google Apps Script Web App (`doPost`) | `LockService.getScriptLock()` prevents race conditions; server-side validation rejects spoofed requests. |
| **Annual Fee & Category** | Server-Authoritative (`Code.gs`) | Fee is calculated on the server using an internal constant map (`platinum: ₹10,000`, `gold: ₹5,000`, `silver: ₹1,000`). Client fee values are disregarded. |
| **Document Storage** | Private Google Drive Folder | Stored in a restricted folder. Only authorised SOF administrators have access. Filenames are namespaced (`SOF-XXXXXXXX_ProofOfIdentity.pdf`). |
| **Document Links** | Google Spreadsheet (`Applications` tab) | Only **Private Drive File IDs** are stored in the sheet (columns V & W). Public shareable links are **never generated or exposed**. |
| **Rollback Mechanism** | Apps Script Error Handler | If Sheet append fails or one document fails, any uploaded files in that transaction are automatically moved to trash (`rollbackFiles`). |
| **Concealed Credentials** | Frontend & Repository | No Google Service Account private keys or admin credentials exist in frontend code or git repository. |

---

## 3. Responsive Layout & Accessibility Verification

- [x] **Desktop (1200px+)**: 2-column grid for compact personal fields, full-width cards for addresses, statements, and document uploads.
- [x] **Tablet (768px - 1024px)**: Fluid responsive column wrapping, accessible pill selectors, clear touch targets.
- [x] **Mobile (< 768px)**: Single column stack, touch-friendly 44px+ buttons and file pickers, sticky progress indications, no horizontal scroll overflow.
- [x] **Accessibility**:
  - Proper `<label htmlFor="...">` associations on all input elements.
  - ARIA attributes (`aria-required`, `aria-invalid`, `aria-describedby`).
  - Native keyboard navigation (Tab, Enter, Space) supported across all radio pills, checkboxes, and buttons.
