<?php
/**
 * config.php — shared settings for the appointment & contact API endpoints.
 *
 * SECURITY NOTE: On shared hosting, this file is fine inside /api/ as long as
 * PHP is executed (never served as plain text) for .php files — which is the
 * default on virtually all PHP hosts. If you want extra safety, move this
 * file one level above the public web root and require_once it with a
 * relative path instead.
 */

// ---- CORS ---------------------------------------------------------------
// Only this origin will be allowed to call the API. Set it to your real
// domain before going live (no trailing slash).
define('ALLOWED_ORIGIN', 'https://www.example-clinic.com');

// ---- Notification email ---------------------------------------------------
// Where appointment/contact notifications are sent, and what "From" address
// to use. Many hosts require the From address to match your domain or the
// server may reject/flag the mail — check with your host if delivery fails.
define('CLINIC_NOTIFY_EMAIL', 'info@example-clinic.com');
define('MAIL_FROM_ADDRESS', 'no-reply@example-clinic.com');
define('MAIL_FROM_NAME', '[Clinic Name] Website');

/**
 * PHP's built-in mail() function (used below) depends on the server having
 * a working local MTA (sendmail/postfix) — this works on many shared hosts
 * out of the box, but delivery can be unreliable or land in spam. For
 * production, consider swapping mail() for PHPMailer + SMTP (Gmail,
 * SendGrid, Mailgun, etc.) instead: https://github.com/PHPMailer/PHPMailer
 */

// ---- Storage --------------------------------------------------------------
// Simple append-only log as a backup/record, independent of email delivery.
// For a real admin dashboard, replace this with writes to a database instead.
define('STORAGE_DIR', __DIR__ . '/storage');

// ---- Basic rate limiting ---------------------------------------------------
// Minimum seconds between two submissions from the same IP, per endpoint.
// This is a lightweight deterrent, not a substitute for a proper WAF.
define('RATE_LIMIT_SECONDS', 30);
