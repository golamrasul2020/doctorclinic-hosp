# PHP Backend — Appointment & Contact API

Two framework-free PHP endpoints that receive the site's forms, validate and
sanitize the data server-side, store a backup log, and email the clinic.

```text
api/
├── config.php        Edit this first: your domain, notify email, from address
├── helpers.php        Shared validation/sanitization/mail/rate-limit functions
├── appointments.php   POST endpoint for the appointment form
├── contact.php         POST endpoint for the contact form
├── storage/            Append-only submission logs + rate-limit files
│   └── .htaccess       Blocks direct web access to this folder (Apache)
└── README.md            This file
```

## 1. Requirements

- PHP 7.4+ (no Composer packages required — everything here is dependency-free)
- A web server that executes `.php` files: Apache, Nginx+PHP-FPM, or any
  standard shared-hosting PHP plan
- A working local mail transfer agent (most shared hosts have this by
  default) for `mail()` to actually deliver email — see step 4 below

## 2. Configure

Open `config.php` and set:

- `ALLOWED_ORIGIN` — your real site URL (used for the CORS header)
- `CLINIC_NOTIFY_EMAIL` — where booking/contact notifications should go
- `MAIL_FROM_ADDRESS` / `MAIL_FROM_NAME` — the "From" shown on those emails
  (many hosts require this to match your domain, or mail gets flagged)

## 3. Deploy

Upload the whole `doctor-clinic/` folder (including `api/`) to your PHP
host exactly as-is — no build step, no `composer install`. If the site and
API share the same domain, the frontend's relative paths (`/api/appointments.php`,
`/api/contact.php`) will work immediately.

If the API is hosted on a **different** domain/subdomain than the static
site, open `assets/js/appointment.js` and set:
```js
const API_BASE = 'https://api.your-clinic.com';
```
and update the `fetch('/api/contact.php', ...)` call in `contact.html` to
use the same base URL. You'll also need `ALLOWED_ORIGIN` in `config.php` to
match the site's real domain, or the browser will block the request.

## 4. Email delivery

`helpers.php` uses PHP's built-in `mail()` function, which relies on the
server having a working MTA (sendmail/postfix). This works out of the box
on many shared hosts, but:
- Delivery isn't guaranteed and messages can land in spam.
- Some hosts disable `mail()` entirely or require SPF/DKIM records set up
  for your domain first.

Every submission is also written to `api/storage/` regardless of whether
the email sends, so nothing is lost even if mail delivery fails — check
those files if a notification email doesn't arrive.

For more reliable delivery, swap `send_notification_email()` in
`helpers.php` for [PHPMailer](https://github.com/PHPMailer/PHPMailer) or
[Symfony Mailer](https://symfony.com/doc/current/mailer.html) configured
with SMTP credentials from a provider like SendGrid, Mailgun, or your own
mailbox.

## 5. Storage & privacy

`api/storage/*.log` files contain patient names, phone numbers, emails and
messages in plain JSON lines — treat this folder as containing personal
data. The included `.htaccess` blocks direct web access on Apache; on
Nginx, add an equivalent `deny all;` rule for `/api/storage/` in your
server config. Rotate/delete old logs periodically, and make sure backups
of this folder are stored securely.

For anything beyond a small clinic's volume, replace `store_submission()`
in `helpers.php` with writes to a real database (MySQL/PostgreSQL) instead
of flat files, and consider building a simple authenticated admin page to
view and manage submissions.

## 6. Spam protection already included

- **Honeypot field** — both forms include a hidden `website` input. Real
  visitors never see or fill it (via CSS); bots that fill every field
  trigger a silent no-op response.
- **Rate limiting** — `enforce_rate_limit()` blocks repeat submissions from
  the same IP within `RATE_LIMIT_SECONDS` (default 30s) per endpoint.
- **Server-side validation** — every field is re-validated in PHP; the
  frontend's `validation.js` is UX only and not trusted here.

None of this replaces a CAPTCHA if you see determined spam — consider
adding [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/)
or Google reCAPTCHA to both forms if that becomes a problem.

## 7. Testing locally

With PHP installed, run from the project root:
```bash
php -S localhost:8000
```
Then open `http://localhost:8000/appointment.html` in a browser — the form
will POST to `http://localhost:8000/api/appointments.php` on the same
server. (`ALLOWED_ORIGIN` in `config.php` only matters for cross-origin
requests; same-origin requests like this aren't blocked by it.)
