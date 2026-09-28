<?php
/**
 * helpers.php — small, dependency-free utilities shared by appointments.php
 * and contact.php. Kept framework-free so this drops into any PHP host.
 */

require_once __DIR__ . '/config.php';

/** Trim, strip tags, and collapse a value to a plain string. */
function clean_str($value, int $maxLen = 500): string {
    $value = is_string($value) ? $value : '';
    $value = trim(strip_tags($value));
    return mb_substr($value, 0, $maxLen);
}

function is_valid_email(string $value): bool {
    return filter_var($value, FILTER_VALIDATE_EMAIL) !== false;
}

function is_valid_phone(string $value): bool {
    $digits = preg_replace('/\D/', '', $value);
    return strlen($digits) >= 10 && strlen($digits) <= 15;
}

function is_valid_future_date(string $value): bool {
    $date = DateTime::createFromFormat('Y-m-d', $value);
    if (!$date) return false;
    $today = new DateTime('today');
    return $date >= $today;
}

/**
 * Reads and JSON-decodes the raw POST body. Returns an empty array on
 * malformed input rather than throwing, so callers can validate normally
 * and return a clean 400 response.
 */
function read_json_body(): array {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw ?: '', true);
    return is_array($data) ? $data : [];
}

/** Sends a standard JSON response and stops execution. */
function json_response(int $statusCode, array $payload): void {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload);
    exit;
}

/** Applies the shared CORS + method-handling headers. Call this first. */
function apply_cors_and_method_guard(): void {
    header('Access-Control-Allow-Origin: ' . ALLOWED_ORIGIN);
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        json_response(405, ['ok' => false, 'error' => 'Method not allowed']);
    }
}

/**
 * Very small file-based rate limiter keyed by IP + endpoint name.
 * Good enough to deter casual form-spam scripts; use a real store
 * (Redis, DB) if you need this to hold up under real abuse traffic.
 */
function enforce_rate_limit(string $endpoint): void {
    if (!is_dir(STORAGE_DIR)) {
        @mkdir(STORAGE_DIR, 0755, true);
    }
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $key = preg_replace('/[^a-zA-Z0-9]/', '_', $endpoint . '_' . $ip);
    $file = STORAGE_DIR . '/ratelimit_' . $key . '.txt';

    if (file_exists($file)) {
        $last = (int) file_get_contents($file);
        if (time() - $last < RATE_LIMIT_SECONDS) {
            json_response(429, ['ok' => false, 'error' => 'Too many requests — please wait a moment and try again.']);
        }
    }
    @file_put_contents($file, (string) time());
}

/** Appends a JSON line to a per-day log file as a simple backup record. */
function store_submission(string $type, array $data): void {
    if (!is_dir(STORAGE_DIR)) {
        @mkdir(STORAGE_DIR, 0755, true);
    }
    $file = STORAGE_DIR . '/' . $type . '_' . date('Y-m-d') . '.log';
    $line = json_encode(array_merge(['received_at' => date('c'), 'ip' => $_SERVER['REMOTE_ADDR'] ?? ''], $data));
    @file_put_contents($file, $line . PHP_EOL, FILE_APPEND | LOCK_EX);
}

/**
 * Sends a plain-text notification email using PHP's built-in mail().
 * Returns true/false; callers should not fail the whole request just
 * because mail delivery failed, since the submission is already logged.
 */
function send_notification_email(string $subject, string $body, ?string $replyTo = null): bool {
    $headers = [];
    $headers[] = 'From: ' . MAIL_FROM_NAME . ' <' . MAIL_FROM_ADDRESS . '>';
    if ($replyTo && is_valid_email($replyTo)) {
        $headers[] = 'Reply-To: ' . $replyTo;
    }
    $headers[] = 'Content-Type: text/plain; charset=UTF-8';

    return @mail(CLINIC_NOTIFY_EMAIL, $subject, $body, implode("\r\n", $headers));
}
