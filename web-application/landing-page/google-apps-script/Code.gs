/**
 * ==============================================================================
 * GYMEZY LANDING PAGE - GOOGLE APPS SCRIPT FOR GOOGLE SHEETS INTEGRATION
 * ==============================================================================
 *
 * This script receives lead capture submissions (Demo requests & Interest registrations)
 * from the GYMEZY landing page and appends them to a Google Sheet automatically.
 *
 * SETUP INSTRUCTIONS:
 * 1. Open Google Sheets (https://sheets.new) and create a new Spreadsheet named "GYMEZY Leads".
 * 2. In Row 1, add these column headers:
 *    A1: Timestamp
 *    B1: Category (Demo / Interest)
 *    C1: Plan
 *    D1: Gym / Fitness Center Name
 *    E1: Owner / Contact Person
 *    F1: Mobile Number
 *    G1: Email Address
 *    H1: City
 *    I1: Area / Location
 *    J1: Gym Type
 *    K1: Current Members
 *    L1: Notes / Details
 *    M1: Source URL
 *
 * 3. In the Google Sheet, go to Extensions -> Apps Script.
 * 4. Delete any default code and paste this entire file content.
 * 5. Click "Deploy" -> "New deployment".
 * 6. Select type: "Web app".
 * 7. Configuration:
 *    - Description: "GYMEZY Lead Capture Endpoint"
 *    - Execute as: "Me (your email)"
 *    - Who has access: "Anyone" (CRITICAL: Must be "Anyone" so the landing page can submit without login)
 * 8. Click "Deploy" and authorize access.
 * 9. Copy the generated "Web App URL" (starts with https://script.google.com/macros/s/...).
 * 10. Paste this URL into your `.env` file in the landing page project:
 *     VITE_GOOGLE_SHEET_WEBAPP_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
 * ==============================================================================
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000); // Prevent concurrent write race conditions

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Auto-create header row if sheet is completely empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Category",
        "Plan",
        "Gym / Fitness Center Name",
        "Owner / Contact Person",
        "Mobile Number",
        "Email Address",
        "City",
        "Area / Location",
        "Gym Type",
        "Current Members",
        "Notes / Requirement",
        "Page URL"
      ]);

      // Format header row nicely
      var headerRange = sheet.getRange(1, 1, 1, 13);
      headerRange.setBackground("#00bf62");
      headerRange.setFontColor("#080c14");
      headerRange.setFontWeight("bold");
      sheet.setFrozenRows(1);
    }

    var data;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      data = e.parameter;
    } else {
      data = {};
    }

    var mobileValue = data.mobile ? data.mobile.toString().trim() : "";
    if (mobileValue.startsWith("+") || mobileValue.startsWith("=") || mobileValue.startsWith("-")) {
      mobileValue = "'" + mobileValue;
    }

    var row = [
      data.timestamp || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      data.category || "General Inquiry",
      data.plan || "Standard",
      data.gymName || "",
      data.ownerName || "",
      mobileValue,
      data.email || "",
      data.city || "",
      data.area || "",
      data.gymType || "",
      data.membersCount || "",
      data.notes || "",
      data.pageUrl || ""
    ];

    sheet.appendRow(row);

    // Return clean JSON response
    return ContentService
      .createTextOutput(JSON.stringify({ result: "success", row: sheet.getLastRow() }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "GYMEZY Lead Capture Endpoint Active" }))
    .setMimeType(ContentService.MimeType.JSON);
}
