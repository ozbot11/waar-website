const SHEET_ID = 'PASTE_SHEET_ID_HERE';

/**
 * Paste ALL of this into Google Apps Script Code.gs (replace myFunction).
 *
 * 1. Open your Google Sheet. From the URL, copy the ID:
 *    https://docs.google.com/spreadsheets/d/  PASTE_THIS_ID  /edit
 * 2. Put that ID in SHEET_ID on line 1 above (replace PASTE_SHEET_ID_HERE).
 * 3. Save. Select testWrite → Run. Approve Spreadsheet + Drive access.
 *    You should see a TEST row on the Applications tab.
 * 4. Deploy → Manage deployments → Edit (pencil) → New version
 *    Type: Web app · Execute as: Me · Who has access: Anyone
 * 5. Put the /exec URL in waar-site/.env as PUBLIC_APPLY_WEBHOOK=...
 * 6. Restart npm run dev and submit the site form again.
 *
 * Open the /exec URL in a browser. It should say: WAAR apply receiver is live
 */

const HEADERS = [
  'Submitted',
  'Name',
  'UW Email',
  'Member status',
  'Discord',
  'Phone',
  'GitHub',
  'Returnee subsystem',
  'Returnee project',
  'Same subsystem',
  'Leadership',
  'Kickoff',
  'Bylaws',
  'Former subsystem',
  'Former project',
  'How left',
  'Former ack',
  'Major',
  'Year',
  'Shop training',
  'Motivation',
  'Robotics exp',
  'Software exp',
  'STEM exp',
  'Subteam fit',
  'Other RSOs',
  'Hear about',
  'Anything else',
  'Hours OK',
  'Certify',
  'Resume',
];

function writeApplication_(data) {
  data = data || {};
  const sheet = applicationsSheet_();
  let resumeUrl = '';
  if (data.resume && data.resume.base64) {
    const folder = folder_('WAAR Application Resumes');
    const bytes = Utilities.base64Decode(data.resume.base64);
    const blob = Utilities.newBlob(
      bytes,
      data.resume.type || 'application/pdf',
      data.resume.name || 'resume.pdf'
    );
    resumeUrl = folder.createFile(blob).getUrl();
  }

  sheet.appendRow([
    data.submittedAt || new Date(),
    data.name || '',
    data.uwEmail || '',
    data.memberStatus || '',
    data.discord || '',
    data.phone || '',
    data.github || '',
    data.returneeSubsystem || '',
    data.returneeProject || '',
    data.sameSubsystem || '',
    data.leadership || '',
    data.kickoff || '',
    data.bylaws || '',
    data.formerSubsystem || '',
    data.formerProject || '',
    data.howLeft || '',
    data.formerAck || '',
    data.major || '',
    data.year || '',
    data.shop || '',
    data.motivation || '',
    data.roboticsExp || '',
    data.softwareExp || '',
    data.stemExp || '',
    data.subteamFit || '',
    data.otherRsos || '',
    data.hearAbout || '',
    data.anythingElse || '',
    data.hoursOk || '',
    data.certify || '',
    resumeUrl || data.resumeNote || '',
  ]);
}

function wantsTest_(e) {
  if (!e) return false;
  if (e.parameter && String(e.parameter.test) === '1') return true;
  if (e.parameters && e.parameters.test && String(e.parameters.test[0]) === '1') return true;
  if (e.queryString && /(^|&)test=1(&|$)/.test(e.queryString)) return true;
  return false;
}

function doGet(e) {
  if (wantsTest_(e)) {
    try {
      testWrite();
      return ContentService.createTextOutput('Wrote a TEST row to: ' + spreadsheet_().getUrl());
    } catch (err) {
      return ContentService.createTextOutput('WRITE FAILED: ' + String(err));
    }
  }
  const raw = e && e.parameter && e.parameter.payload;
  if (raw) {
    try {
      writeApplication_(JSON.parse(raw));
      return ContentService.createTextOutput('Application saved');
    } catch (err) {
      return ContentService.createTextOutput('WRITE FAILED: ' + String(err));
    }
  }
  return ContentService.createTextOutput('WAAR apply receiver v3 is live');
}

function readPayload_(e) {
  if (e && e.parameter && e.parameter.payload) return e.parameter.payload;
  const contents = e && e.postData && e.postData.contents ? String(e.postData.contents) : '';
  if (!contents) return '{}';
  if (contents.charAt(0) === '{') return contents;
  const match = contents.match(/(?:^|&)payload=([^&]*)/);
  if (match) return decodeURIComponent(match[1].replace(/\+/g, ' '));
  return contents;
}

function doPost(e) {
  try {
    writeApplication_(JSON.parse(readPayload_(e) || '{}'));
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(
      ContentService.MimeType.JSON
    );
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: String(err) })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function testWrite() {
  const sheet = applicationsSheet_();
  sheet.appendRow([
    new Date().toISOString(),
    'TEST from Apps Script',
    'test@uw.edu',
    'returnee',
  ]);
}

function applicationsSheet_() {
  const ss = spreadsheet_();
  let sheet = ss.getSheetByName('Applications');
  if (!sheet) {
    sheet = ss.insertSheet('Applications');
    sheet.appendRow(HEADERS);
  }
  if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
  return sheet;
}

function sheetId_() {
  const id = String(SHEET_ID || '').trim();
  if (!id || id.indexOf('PASTE_') === 0) return '';
  return id;
}

function spreadsheet_() {
  const id = sheetId_();
  if (id) {
    try {
      return SpreadsheetApp.openById(id);
    } catch (err) {
      throw new Error(
        'Could not open that spreadsheet. Confirm SHEET_ID is from docs.google.com/spreadsheets/d/ID/edit and this Google account can open it. Detail: ' +
          err
      );
    }
  }
  const active = SpreadsheetApp.getActiveSpreadsheet();
  if (active) return active;
  const props = PropertiesService.getScriptProperties();
  const saved = props.getProperty('SHEET_ID');
  if (saved) return SpreadsheetApp.openById(saved);
  const created = SpreadsheetApp.create('WAAR Applications');
  props.setProperty('SHEET_ID', created.getId());
  return created;
}

function folder_(name) {
  const it = DriveApp.getFoldersByName(name);
  return it.hasNext() ? it.next() : DriveApp.createFolder(name);
}
