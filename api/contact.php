<?php
/**
 * contact.php — POST /api/contact.php
 *
 * Accepts the JSON payload produced by the inline script in contact.html,
 * validates and sanitizes it server-side, logs it to /api/storage/, and
 * emails the clinic. Responds with JSON.
 *
 * Expected payload: { name, email, phone, subject, message, website }
 * "website" is a honeypot field — real users leave it blank.
 */

require_once __DIR__ . '/helpers.php';

apply_cors_and_method_guard();
enforce_rate_limit('contact');

$input = read_json_body();

if (!empty($input['website'])) {
    json_response(200, ['ok' => true]);
}

$errors = [];

$name    = clean_str($input['name'] ?? '', 120);
$email   = clean_str($input['email'] ?? '', 190);
$phone   = clean_str($input['phone'] ?? '', 30);
$subject = clean_str($input['subject'] ?? '', 150);
$message = clean_str($input['message'] ?? '', 2000);

if (mb_strlen($name) < 2)                 $errors['name'] = 'Please provide your name.';
if (!is_valid_email($email))              $errors['email'] = 'Please provide a valid email address.';
if ($phone !== '' && !is_valid_phone($phone)) $errors['phone'] = 'Please provide a valid phone number.';
if (mb_strlen($subject) < 3)              $errors['subject'] = 'Please provide a subject.';
if (mb_strlen($message) < 10)             $errors['message'] = 'Please provide a message (at least 10 characters).';

if (!empty($errors)) {
    json_response(422, ['ok' => false, 'error' => 'Validation failed', 'fields' => $errors]);
}

$record = compact('name', 'email', 'phone', 'subject', 'message');
store_submission('contact', $record);

$mailSubject = 'New contact message — ' . $subject;
$body = "A new contact form message was submitted on the website:\n\n"
      . "Name:    $name\n"
      . "Email:   $email\n"
      . "Phone:   " . ($phone !== '' ? $phone : '(not provided)') . "\n"
      . "Subject: $subject\n\n"
      . "Message:\n$message\n";
send_notification_email($mailSubject, $body, $email);

json_response(200, ['ok' => true, 'message' => 'Message received.']);
