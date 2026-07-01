/**
 * DOMICA landing-page intake form backend.
 *
 * What it does on each submission:
 *   1. Appends a row to the "Submissions" sheet (created automatically).
 *   2. Emails a notification to NOTIFY_EMAIL.
 *
 * Setup is documented in ../FORM-SETUP.md. In short: create a Google Sheet,
 * open Extensions > Apps Script, paste this file, then Deploy > New deployment
 * > Web app (Execute as: Me, Who has access: Anyone), and copy the /exec URL.
 */

const NOTIFY_EMAIL = 'info@domicahomes.com';
const SHEET_NAME = 'Submissions';

const HEADERS = [
  'Timestamp', 'Company', 'Contact', 'Role', 'Email', 'Phone',
  'Industry', 'Market', 'Employees', 'Staffing pattern',
  'Beds/units', 'Move-in timing', 'Budget', 'Subsidizes today',
  'Services', 'Services (other)', 'Current situation',
  'Heard about us', 'Source page'
];

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // Honeypot: the hidden "website" field is invisible to real users. If a
    // bot filled it (or posted directly, bypassing the page), silently accept
    // and drop it — no row, no email, and no signal that it was rejected.
    if (data.website && String(data.website).trim() !== '') {
      return json({ ok: true });
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    const row = [
      new Date(),
      data.companyName || '',
      data.contactName || '',
      data.role || '',
      data.email || '',
      data.phone || '',
      data.employerType || '',
      data.market || '',
      data.employees || '',
      data.seasonality || '',
      data.beds || '',
      data.timing || '',
      data.budget || '',
      data.subsidize || '',
      (data.services || []).join(', '),
      data.servicesOther || '',
      data.situation || '',
      data.heard || '',
      data.source || ''
    ];
    sheet.appendRow(row);

    const subject = 'New DOMICA inquiry: ' + (data.companyName || 'Unknown company');
    const body = HEADERS.map(function (h, i) { return h + ': ' + row[i]; }).join('\n');
    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: subject,
      body: body,
      replyTo: data.email || NOTIFY_EMAIL
    });

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function doGet() {
  return ContentService.createTextOutput('DOMICA intake endpoint is live.');
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
