# Google Apps Script Setup & Deployment Guide

This guide walks you through deploying the Google Apps Script Web App for the **Science Orbit Forum (SOF) Membership Application Form**.

---

## Architecture Overview

```
[ User Browser (React / Vite) ]
        │
        │ HTTP POST (Base64 Docs + JSON)
        ▼
[ Google Apps Script Web App (Code.gs) ]
        │
        ├── 1. Validates fields, mime-types, file sizes (5 MB)
        ├── 2. Computes official annual fee server-side
        ├── 3. Obtains LockService lock to eliminate concurrency race
        ├── 4. Uploads documents to Private Google Drive Folder (no public links)
        ├── 5. Appends application row to Google Sheet "Applications"
        └── 6. Returns JSON: { ok: true, reference: "SOF-XXXXXXXX", ... }
```

---

## Step 1: Create the Google Spreadsheet

1. Open [Google Sheets](https://sheets.google.com/) while signed in with the authorised SOF administrator Google account.
2. Create a new spreadsheet named: **`SOF Membership Applications 2026`**.
3. Rename the first sheet tab from `Sheet1` to **`Applications`**.
4. Note the **Spreadsheet ID** from the browser URL:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit
   ```
   *The string between `/d/` and `/edit` is your `SPREADSHEET_ID`.*

---

## Step 2: Create the Private Google Drive Folder

1. Open [Google Drive](https://drive.google.com/).
2. Create a new folder named: **`SOF Membership Documents (Confidential)`**.
3. **Important Privacy Step:**
   - Right-click the folder and choose **Share**.
   - Ensure "General access" is set to **Restricted** (Only people with access can open with the link).
   - Only authorised SOF administrators should be added as viewers or editors.
   - Do **NOT** set this to "Anyone with the link".
4. Open the folder and copy the **Folder ID** from the browser URL:
   ```
   https://drive.google.com/drive/folders/DRIVE_FOLDER_ID_HERE
   ```
   *The string after `/folders/` is your `DRIVE_FOLDER_ID`.*

---

## Step 3: Create the Apps Script Project

1. Return to your Google Spreadsheet.
2. In the top menu, click **Extensions** > **Apps Script**.
3. In the Apps Script editor, rename the project in the top left from *Untitled project* to **`SOF Membership Backend`**.
4. Replace the default content of `Code.gs` with the entire contents of [`google-apps-script/Code.gs`](./Code.gs).

---

## Step 4: Configure Script Properties (Recommended)

Instead of hardcoding IDs directly in the script code, configure them via Script Properties:

1. In the Apps Script left sidebar, click the **Gear icon (Project Settings)**.
2. Scroll down to **Script Properties** and click **Edit script properties** -> **Add script property**.
3. Add the following pairs:
   - **`SPREADSHEET_ID`**: Paste your Google Spreadsheet ID from Step 1.
   - **`SHEET_NAME`**: Enter `Applications`.
   - **`DRIVE_FOLDER_ID`**: Paste your Google Drive Folder ID from Step 2.
4. Click **Save script properties**.

*(Alternatively, you can paste the IDs into the `CONFIG` constant at the top of `Code.gs`).*

---

## Step 5: Initial Test Run & Permission Authorisation

1. In the Apps Script code editor, select the function dropdown next to the "Debug" button and select **`doGet`**.
2. Click **Run**.
3. Google will show an **Authorization Required** dialog:
   - Click **Review permissions**.
   - Select your authorised SOF Google account.
   - If prompted with "Google hasn't verified this app", click **Advanced** -> **Go to SOF Membership Backend (unsafe)**.
   - Click **Allow** to permit access to Google Sheets and Google Drive.
4. The execution log should complete with status `Completed`.

---

## Step 6: Deploy as Web App

1. In the top right corner of Apps Script, click **Deploy** > **New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Fill in the deployment settings:
   - **Description**: `Science Orbit Forum Membership API v1`
   - **Execute as**: **`Me (your_email@gmail.com)`**
   - **Who has access**: **`Anyone`** *(Required so public applicants can submit without needing Google logins)*
4. Click **Deploy**.
5. Copy the **Web App URL**. It looks like:
   ```
   https://script.google.com/macros/s/AKfycbx.../exec
   ```

---

## Step 7: Configure Frontend

In your website root directory, create or edit your `.env` file (or `.env.local`):

```bash
VITE_MEMBERSHIP_SCRIPT_URL="https://script.google.com/macros/s/AKfycbx.../exec"
```

Rebuild or restart your development server:
```bash
npm run dev
# or for production build
npm run build
```

---

## Step 8: Updating the Script in the Future

Whenever you modify `Code.gs`:
1. Save your code in Apps Script (`Ctrl + S`).
2. Click **Deploy** > **Manage deployments**.
3. Select your active deployment and click the **Pencil (Edit)** icon.
4. Change **Version** to **New version**.
5. Click **Deploy**.
*(Note: If you do not create a new version, changes will not take effect on the live URL!)*
