/**
 * ==============================================================================
 * GYMEZY LANDING PAGE - GOOGLE APPS SCRIPT FOR GOOGLE SHEETS INTEGRATION
 * ==============================================================================
 *
 * This script intelligently handles submissions for both:
 * 1. Gym Owners / Trainers (Lead Capture & Partner Onboarding)
 * 2. Customers (Launch Offers & Early VIP Pass Reservations)
 *
 * If you use separate tabs in your Google Sheet:
 * - "Gym Leads" tab for Gym Owners / Trainers
 * - "Customer Leads" tab for Customers
 * (Or if only one tab exists, it will record into the Active Sheet automatically)
 * ==============================================================================
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000); // Prevent concurrent write race conditions

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var data = {};

    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      data = e.parameter;
    }

    var isCustomer = data.category === 'Customer' || data.type === 'Customer Launch Offer Registration' || !!data.place || !!data.experience;
    var sheetName = isCustomer ? "Customer Leads" : "Gym Leads";
    var sheet = ss.getSheetByName(sheetName) || ss.getActiveSheet();

    // Auto-create header row if sheet is completely empty
    if (sheet.getLastRow() === 0) {
      if (isCustomer) {
        sheet.appendRow([
          "Timestamp",
          "Type",
          "Full Name",
          "Mobile Number",
          "Email Address",
          "City / Location",
          "Fitness Experience",
          "Age Group",
          "Fitness Goal",
          "Source URL"
        ]);
        var headerRange = sheet.getRange(1, 1, 1, 10);
        headerRange.setBackground("#00bf62");
        headerRange.setFontColor("#080c14");
        headerRange.setFontWeight("bold");
        sheet.setFrozenRows(1);
      } else {
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
          "Notes / Requirement",
          "Page URL"
        ]);
        var headerRange = sheet.getRange(1, 1, 1, 11);
        headerRange.setBackground("#00bf62");
        headerRange.setFontColor("#080c14");
        headerRange.setFontWeight("bold");
        sheet.setFrozenRows(1);
      }
    }

    var mobileValue = data.mobile ? data.mobile.toString().trim() : "";
    if (mobileValue.startsWith("+") || mobileValue.startsWith("=") || mobileValue.startsWith("-")) {
      mobileValue = "'" + mobileValue;
    }

    var row;
    if (isCustomer) {
      row = [
        data.timestamp || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
        data.type || "Customer Launch Offer Registration",
        data.name || "",
        mobileValue,
        data.email || "",
        data.place || "",
        data.experience || "",
        data.age || "",
        data.goal || "",
        data.pageUrl || ""
      ];
    } else {
      row = [
        data.timestamp || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
        data.category || "Gym Owner / Trainer",
        data.plan || "Partner Network",
        data.gymName || "",
        data.ownerName || "",
        mobileValue,
        data.email || "",
        data.city || "",
        data.area || "",
        data.notes || "",
        data.pageUrl || ""
      ];
    }

    sheet.appendRow(row);

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
