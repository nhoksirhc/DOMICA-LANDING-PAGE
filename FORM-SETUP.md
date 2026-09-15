# Wiring the intake form to a Google Sheet + email

When someone completes the landing-page form, the submission is sent to a
**Google Apps Script web app** that (1) appends a row to a Google Sheet and
(2) emails a notification to `info@domicahomes.com`.

You do the Google setup once (about 2 minutes). Then send me the deployment
URL and I'll connect the form to it.

## 1. Create the Google Sheet
1. Go to <https://sheets.google.com> and create a **new blank spreadsheet**.
2. Name it something like `DOMICA — Form submissions`.
   (You don't need to add any columns; the script creates them automatically.)

## 2. Add the script
1. In that sheet, click **Extensions → Apps Script**.
2. Delete whatever is in the editor, then paste the entire contents of
   [`google-apps-script/Code.gs`](google-apps-script/Code.gs).
3. Click the **Save** icon (💾).

## 3. Deploy it as a web app
1. Click **Deploy → New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Set:
   - **Description:** `DOMICA intake`
   - **Execute as:** **Me**
   - **Who has access:** **Anyone**  ← important, so the public form can reach it
4. Click **Deploy**.
5. Click **Authorize access** and approve the permissions (Sheets + send email).
   You may see a "Google hasn't verified this app" screen — click
   **Advanced → Go to (project name)** to continue. It's your own script.
6. Copy the **Web app URL**. It looks like:
   `https://script.google.com/macros/s/AKfy.....x/exec`

## 4. Send me the URL
Paste that `/exec` URL back to me. I'll drop it into the form, redeploy the
site, and submit a test entry so we can confirm a row lands in the sheet and
the email arrives.

## Changing the notification email later
Edit `NOTIFY_EMAIL` at the top of `Code.gs` in the Apps Script editor, then
**Deploy → Manage deployments → Edit → Deploy** to publish the change.
(The web app URL stays the same.)
