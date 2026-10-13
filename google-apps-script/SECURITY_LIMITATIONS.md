# Security & Architectural Limitations Notice

**Application:** Science Orbit Forum (SOF) Membership Application System  
**Architecture:** Static Web Frontend (React/Vite) + Google Apps Script Web App Endpoint + Private Google Drive & Google Sheets

---

## 1. Security Safeguards Implemented

1. **Server-Authoritative Validation:**
   - Categories, annual fees, and application status (`Pending`) are enforced strictly on the server. The client cannot spoof fee amounts or approve applications.
2. **Private Document Storage:**
   - Uploaded files are deposited into a private Google Drive folder owned by the administrator.
   - Files are stored with strict restricted permissions. Only file IDs (not public view links or sharing tokens) are recorded in the Google Sheet.
3. **MIME Type & Size Protection:**
   - Server decodes base64 bytes and validates byte size ($\le 5\text{ MB}$) and MIME types before saving.
4. **Transaction Rollback:**
   - If writing to Google Sheets fails or if the second file upload fails, previously uploaded files in that attempt are automatically purged (`trashed`) to eliminate orphaned files.
5. **Concurrency Race-Condition Protection:**
   - `LockService.getScriptLock()` prevents multiple concurrent submissions from overwriting sheet rows simultaneously.
6. **No Secret Exposure in Frontend:**
   - No Google Service Account private keys, database passwords, or Google Cloud OAuth client secrets are exposed to the browser. Only the public Apps Script deployment URL is communicated with.

---

## 2. Inherent Limitations & Architectural Considerations

While Google Apps Script is free, serverless, and integrates natively with Google Sheets and Drive, administrators should be aware of the following platform constraints:

### A. Apps Script Request Payload Quota
- Google Apps Script web apps have a maximum request payload size of approximately **10 MB - 50 MB** per execution.
- By capping individual files at **5 MB**, base64 overhead ($\approx 1.33\times$) yields roughly $6.6\text{ MB}$ per file. Submitting two 5 MB files together is near the threshold of standard Apps Script executions. The form validates and advises keeping documents compact (e.g. 1–3 MB per document).

### B. Google Daily Execution Limits
- Standard free Google accounts (`@gmail.com`) have a daily limit of **90 minutes/day** of Apps Script execution time and **20,000 URL Fetch calls/day**.
- Google Workspace enterprise accounts have higher thresholds (6 hours/day). For typical membership intakes, standard quotas are sufficient.

### C. Public Endpoint Rate Limiting & Abuse
- An Apps Script deployed as *"Execute as: Me"* and *"Who has access: Anyone"* can technically be called by any client that knows the URL.
- Google applies its own DDoS filtering and CAPTCHA / rate-limiting at the Google infrastructure level.
- If high abuse is ever detected in the future, a Cloudflare Turnstile token or a Cloudflare Worker proxy with rate limiting can be placed ahead of the Apps Script endpoint.
