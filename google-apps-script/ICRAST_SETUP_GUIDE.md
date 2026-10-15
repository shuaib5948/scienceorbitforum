# ICRAST-26 Dedicated Spreadsheet & Drive Setup Guide

This guide walks you through setting up a dedicated Google Spreadsheet and dedicated Google Drive folder for conference abstract submissions.

---

## Step 1: Create the Dedicated Google Spreadsheet
1. Open [Google Sheets](https://sheets.new) in your browser.
2. Name the sheet: **`ICRAST-26 Abstract Submissions`**.
3. Copy the **Spreadsheet ID** from your browser address bar:
   `https://docs.google.com/spreadsheets/d/`**`1a2b3c4d5e6f...`**`/edit`
   *(Everything between `/d/` and `/edit`)*

---

## Step 2: Create the Dedicated Google Drive Folder
1. Open [Google Drive](https://drive.google.com).
2. Create a new folder named: **`ICRAST-26 Abstract Documents`**.
3. Open the folder and copy the **Folder ID** from your browser address bar:
   `https://drive.google.com/drive/folders/`**`9z8y7x6w5v4u...`**
   *(The string after `/folders/`)*
4. *(Optional)* Share this folder with your conference reviewers / editorial committee.

---

## Step 3: Open Apps Script & Paste the Backend Code
1. Return to your newly created Google Spreadsheet.
2. In the top menu, click **Extensions** → **Apps Script**.
3. Rename the project from *Untitled project* to **`ICRAST-26 Backend`**.
4. Delete any code in the editor, and paste the entire code from [`google-apps-script/ICRAST_Code.gs`](./ICRAST_Code.gs).
5. At the top of the file, replace the placeholder IDs in `CONFIG`:
   ```javascript
   const CONFIG = {
     SPREADSHEET_ID: 'YOUR_SPREADSHEET_ID_FROM_STEP_1',
     SHEET_NAME: 'Abstracts',
     DRIVE_FOLDER_ID: 'YOUR_DRIVE_FOLDER_ID_FROM_STEP_2',
     ...
   };
   ```
6. Click the **Save** floppy icon (or press Ctrl+S).

---

## Step 4: Deploy as Web App
1. In the top-right corner, click **Deploy** → **New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Set the fields:
   - **Description:** `ICRAST-26 Abstract Submissions API`
   - **Execute as:** `Me (your_email@gmail.com)`
   - **Who has access:** `Anyone` *(Crucial so the website form can submit)*
4. Click **Deploy**.
5. When prompted for authorization:
   - Click **Review permissions**.
   - Choose your Google account.
   - Click **Advanced** → **Go to ICRAST-26 Backend (unsafe)**.
   - Click **Allow**.
6. Copy the **Web app URL** (starts with `https://script.google.com/macros/s/.../exec`).

---

## Step 5: Connect to the Website
1. Open [`.env`](../.env) in this project.
2. Paste your copied URL into `VITE_ICRAST_SCRIPT_URL`:
   ```env
   VITE_ICRAST_SCRIPT_URL="https://script.google.com/macros/s/YOUR_DEPLOYED_ID/exec"
   ```
3. Restart your dev server if running, and test by submitting an abstract from the website!
