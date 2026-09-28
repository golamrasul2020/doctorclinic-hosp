<?php
/**
 * appointments.php — POST /api/appointments.php
 *
 * Accepts the JSON payload produced by assets/js/appointment.js, validates
 * and sanitizes it server-side (the frontend's validation.js is UX only),
 * logs it to /api/storage/, and emails the clinic. Responds with JSON.
 *
 * Expected payload shape (see assets/js/mock-appointment-payload.json):
 * { name, phone, email, age, gender, date, time, service, doctor, message,
 *   website }  <- "website" is a honeypot field; real users leave it blank.
 */

require_once __DIR__ . '/helpers.php';

apply_cors_and_method_guard();
enforce_rate_limit('appointments');

$input = read_json_body();

// Honeypot: bots tend to fill every field. If this hidden field has a
// value, silently pretend success without processing or emailing anything.
if (!empty($input['website'])) {
    json_response(200, ['ok' => true]);
}

$errors = [];

$name    = clean_str($input['name'] ?? '', 120);
$phone   = clean_str($input['phone'] ?? '', 30);
$email   = clean_str($input['email'] ?? '', 190);
$age     = clean_str($input['age'] ?? '', 4);
$gender  = clean_str($input['gender'] ?? '', 20);
$date    = clean_str($input['date'] ?? '', 10);
$time    = clean_str($input['time'] ?? '', 10);
$service = clean_str($input['service'] ?? '', 60);
$doctor  = clean_str($input['doctor'] ?? '', 60);
$message = clean_str($input['message'] ?? '', 1000);

if (mb_strlen($name) < 2)            $errors['name'] = 'Please provide the patient\'s full name.';
if (!is_valid_phone($phone))         $errors['phone'] = 'Please provide a valid phone number.';
if (!is_valid_email($email))         $errors['email'] = 'Please provide a valid email address.';
if (!ctype_digit($age) || (int)$age < 1 || (int)$age > 119) $errors['age'] = 'Please provide a valid age.';
if (!in_array($gender, ['male', 'female', 'other'], true))  $errors['gender'] = 'Please select a gender.';
if (!is_valid_future_date($date))    $errors['date'] = 'Please choose a valid upcoming date.';
if ($time === '')                    $errors['time'] = 'Please select a preferred time.';
if ($service === '')                 $errors['service'] = 'Please select a service.';
if ($doctor === '')                  $errors['doctor'] = 'Please select a doctor.';

if (!empty($errors)) {
    json_response(422, ['ok' => false, 'error' => 'Validation failed', 'fields' => $errors]);
}

$record = compact('name', 'phone', 'email', 'age', 'gender', 'date', 'time', 'service', 'doctor', 'message');
store_submission('appointments', $record);

$subject = 'New appointment request — ' . $name;
$body = "A new appointment request was submitted on the website:\n\n"
      . "Name:    $name\n"
      . "Phone:   $phone\n"
      . "Email:   $email\n"
      . "Age:     $age\n"
      . "Gender:  $gender\n"
      . "Date:    $date\n"
      . "Time:    $time\n"
      . "Service: $service\n"
      . "Doctor:  $doctor\n"
      . "Message: " . ($message !== '' ? $message : '(none)') . "\n";
send_notification_email($subject, $body, $email);

// The submission is safely stored either way, even if mail() delivery
// fails (e.g. no local MTA configured) — so we still report success here.
json_response(200, ['ok' => true, 'message' => 'Appointment request received.']);
