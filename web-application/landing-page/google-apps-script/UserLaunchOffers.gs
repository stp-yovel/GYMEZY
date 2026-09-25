/**
 * ============================================================================
 * GYMEZY USER / MEMBER LAUNCH OFFERS - GOOGLE APPS SCRIPT WEB APP
 * ============================================================================
 * 
 * Instructions to Deploy:
 * 1. Open Google Sheets (create a new blank spreadsheet e.g., "GYMEZY User Launch Offers").
 * 2. Click Extensions > Apps Script.
 * 3. Delete any existing code and paste this entire file.
 * 4. Click "Deploy" (top right) > "New deployment".
 * 5. Select type: "Web app".
 * 6. Set:
 *    - Description: "GYMEZY User Launch Offer Webhook"
 *    - Execute as: "Me" (your Google account)
 *    - Who has access: "Anyone" (CRITICAL for web form submissions)
 * 7. Click "Deploy", authorize permissions, and copy the Web App URL.
 * 8. Add the URL to your `.env` file as:
 *    VITE_USER_LAUNCH_GOOGLE_SHEET_WEBAPP_URL=<YOUR_COPIED_URL>
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Auto-create header row if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Registration Type",
        "Offer / Campaign",
        "Full Name",
        "Mobile Number",
        "Email Address",
        "City / Location",
        "Fitness Experience",
        "Age Group",
        "Fitness Goal",
        "Page URL"
      ]);
      
      // Style header row
      var headerRange = sheet.getRange(1, 1, 1, 11);
      headerRange.setBackground("#080C14");
      headerRange.setFontColor("#00BF62");
      headerRange.setFontWeight("bold");
      headerRange.setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
    }
    
    var data = {};
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    }
    
    // Extract fields safely
    var timestamp = data.timestamp || new Date().toISOString();
    var type = data.type || "User Launch Offer Registration";
    var offer = data.offer || "Launch Offer";
    var name = data.name || "";
    var mobile = data.mobile || ""; // Already formatted with single quote: ' +91 9887625362
    var email = data.email || "";
    var place = data.place || "";
    var experience = data.experience || "";
    var age = data.age || "";
    var goal = data.goal || "";
    var pageUrl = data.pageUrl || "";
    
    // Append row
    sheet.appendRow([
      timestamp,
      type,
      offer,
      name,
      mobile,
      email,
      place,
      experience,
      age,
      goal,
      pageUrl
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: "User launch offer registered successfully" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok", service: "GYMEZY User Launch Offer Webhook" }))
    .setMimeType(ContentService.MimeType.JSON);
}
