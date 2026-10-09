/**
 * ==============================================================================
 * GYMEZY - GYM OWNER & TRAINER LEAD CAPTURE (GOOGLE APPS SCRIPT)
 * ==============================================================================
 * Web App URL used by: VITE_GOOGLE_SHEET_WEBAPP_URL
 * ==============================================================================
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000); // Prevent concurrent write race conditions

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Auto-create comprehensive header row if sheet is completely empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Category",
        "Plan",
        "Gym / Fitness Center Name",
        "Contact / Trainer Name",
        "Mobile Number",
        "Email Address",
        "City",
        "Area / Location",
        "Gym Type",
        "Current Members",
        "Trainer Specialization",
        "Coaching Experience",
        "Notes / Requirement",
        "Page URL"
      ]);

      // Format header row (15 columns)
      var headerRange = sheet.getRange(1, 1, 1, 15);
      headerRange.setBackground("#00bf62");
      headerRange.setFontColor("#080c14");
      headerRange.setFontWeight("bold");
      headerRange.setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
    }

    var data = {};
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e.parameter) {
      data = e.parameter;
    }

    // Format phone number to preserve leading +, zeros, and spacing in Google Sheets
    var mobileValue = data.mobile ? data.mobile.toString().trim() : "";
    if (mobileValue && !mobileValue.startsWith("'")) {
      mobileValue = "'" + mobileValue;
    }

    // Determine contact name based on role
    var contactName = data.ownerName || data.trainerName || data.name || "";

    var row = [
      data.timestamp || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      data.category || "General Inquiry",
      data.plan || "Standard",
      data.gymName || "-",
      contactName,
      mobileValue,
      data.email || "",
      data.city || data.place || "",
      data.area || "",
      data.gymType || "-",
      data.membersCount || "-",
      data.specialization || "-",
      data.experience || "-",
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
