<?php
/**
 * Contact Form Handler — Makumbi George Portfolio
 * Handles form submissions and sends email notifications
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

// ─── Configuration ───────────────────────────────────────────
define('RECIPIENT_EMAIL', 'makumbigeorge@email.com');
define('RECIPIENT_NAME',  'Makumbi George');
define('SITE_NAME',       'Makumbi George Portfolio');

// ─── Sanitize Input ──────────────────────────────────────────
function sanitize(string $input): string {
    return htmlspecialchars(strip_tags(trim($input)), ENT_QUOTES, 'UTF-8');
}

function validateEmail(string $email): bool {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

// ─── Rate Limiting (session-based) ──────────────────────────
session_start();
$now = time();
$rateKey = 'contact_last_sent';
$rateLimitSeconds = 60; // 1 message per minute

if (isset($_SESSION[$rateKey]) && ($now - $_SESSION[$rateKey]) < $rateLimitSeconds) {
    http_response_code(429);
    echo json_encode(['success' => false, 'message' => 'Too many requests. Please wait before sending again.']);
    exit;
}

// ─── Collect & Validate Fields ───────────────────────────────
$name    = sanitize($_POST['name']    ?? '');
$email   = sanitize($_POST['email']   ?? '');
$phone   = sanitize($_POST['phone']   ?? '');
$service = sanitize($_POST['service'] ?? '');
$subject = sanitize($_POST['subject'] ?? '');
$message = sanitize($_POST['message'] ?? '');

$errors = [];

if (empty($name) || strlen($name) < 2) {
    $errors[] = 'Please enter your full name (minimum 2 characters).';
}
if (empty($email) || !validateEmail($email)) {
    $errors[] = 'Please enter a valid email address.';
}
if (empty($subject) || strlen($subject) < 3) {
    $errors[] = 'Please enter a subject for your message.';
}
if (empty($message) || strlen($message) < 10) {
    $errors[] = 'Please enter a message (minimum 10 characters).';
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => implode(' ', $errors)]);
    exit;
}

// ─── Build Email ─────────────────────────────────────────────
$serviceLabels = [
    'web'       => 'Web Development',
    'db'        => 'Database Design / Administration',
    'gis'       => 'GIS Solutions',
    'linux'     => 'Linux Administration',
    'windows'   => 'Windows Server Administration',
    'data'      => 'Data Analysis',
    'consulting'=> 'IT Consulting',
    'other'     => 'Other',
];

$serviceLabel = $serviceLabels[$service] ?? 'Not specified';
$date = date('D, d M Y H:i:s T');

$emailBody = "
New Contact Form Submission — {$date}
=========================================

Name:     {$name}
Email:    {$email}
Phone:    " . ($phone ?: 'Not provided') . "
Service:  {$serviceLabel}

Subject:  {$subject}

Message:
---------
{$message}

=========================================
Sent from: " . SITE_NAME . "
Reply to:  {$email}
";

// HTML version
$htmlBody = "
<!DOCTYPE html>
<html>
<head>
<meta charset='UTF-8'>
<style>
  body { font-family: Arial, sans-serif; background: #f0f4f8; margin: 0; padding: 20px; }
  .card { background: white; border-radius: 12px; max-width: 600px; margin: 0 auto; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
  .header { background: linear-gradient(135deg, #0a2342, #1e6fba); color: white; padding: 30px 36px; }
  .header h2 { margin: 0; font-size: 1.4rem; }
  .header p { margin: 6px 0 0; opacity: 0.8; font-size: 0.875rem; }
  .body { padding: 30px 36px; }
  .field { margin-bottom: 20px; }
  .label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; color: #8899aa; font-weight: 600; margin-bottom: 4px; }
  .value { font-size: 0.95rem; color: #0a2342; font-weight: 500; }
  .message-box { background: #f0f4f8; border-radius: 8px; padding: 16px; margin-top: 20px; font-size: 0.9rem; color: #4a6080; line-height: 1.7; }
  .footer { border-top: 1px solid #e2e8f0; padding: 16px 36px; font-size: 0.8rem; color: #8899aa; background: #f8fafc; }
</style>
</head>
<body>
<div class='card'>
  <div class='header'>
    <h2>📬 New Portfolio Contact</h2>
    <p>{$date}</p>
  </div>
  <div class='body'>
    <div class='field'><div class='label'>From</div><div class='value'>{$name}</div></div>
    <div class='field'><div class='label'>Email</div><div class='value'><a href='mailto:{$email}'>{$email}</a></div></div>
    <div class='field'><div class='label'>Phone</div><div class='value'>" . ($phone ?: 'Not provided') . "</div></div>
    <div class='field'><div class='label'>Service Interested In</div><div class='value'>{$serviceLabel}</div></div>
    <div class='field'><div class='label'>Subject</div><div class='value'>{$subject}</div></div>
    <div class='message-box'>
      <div class='label'>Message</div>
      <p style='margin: 8px 0 0;'>" . nl2br($message) . "</p>
    </div>
  </div>
  <div class='footer'>Sent from Makumbi George's Portfolio Website — <a href='mailto:{$email}'>Reply to {$name}</a></div>
</div>
</body>
</html>
";

// ─── Send Email ──────────────────────────────────────────────
$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-type: text/html; charset=UTF-8\r\n";
$headers .= "From: Portfolio Contact <noreply@makumbigeorge.com>\r\n";
$headers .= "Reply-To: {$name} <{$email}>\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

$emailSubject = "[Portfolio] {$subject} — from {$name}";

$sent = mail(RECIPIENT_EMAIL, $emailSubject, $htmlBody, $headers);

if ($sent) {
    $_SESSION[$rateKey] = $now;

    // Auto-reply to sender
    $replyHeaders  = "MIME-Version: 1.0\r\n";
    $replyHeaders .= "Content-type: text/html; charset=UTF-8\r\n";
    $replyHeaders .= "From: Makumbi George <noreply@makumbigeorge.com>\r\n";

    $replyBody = "
    <html><body style='font-family:Arial,sans-serif;background:#f0f4f8;padding:20px;'>
    <div style='background:white;border-radius:12px;max-width:540px;margin:0 auto;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1);'>
      <div style='background:linear-gradient(135deg,#0a2342,#1e6fba);color:white;padding:30px 36px;'>
        <h2 style='margin:0;'>Thank you, {$name}!</h2>
        <p style='margin:6px 0 0;opacity:0.8;font-size:0.875rem;'>I've received your message.</p>
      </div>
      <div style='padding:30px 36px;color:#4a6080;line-height:1.7;'>
        <p>Hi <strong style='color:#0a2342;'>{$name}</strong>,</p>
        <p>Thank you for reaching out! I've received your message about <strong>{$subject}</strong> and will get back to you within <strong>24 hours</strong>.</p>
        <p>In the meantime, feel free to connect with me on:</p>
        <p>
          <a href='https://linkedin.com/in/makumbigeorge' style='color:#1e6fba;'>LinkedIn</a> &nbsp;|&nbsp;
          <a href='https://github.com/makumbigeorge' style='color:#1e6fba;'>GitHub</a>
        </p>
        <p>Best regards,<br><strong style='color:#0a2342;'>Makumbi George</strong><br>
        Full Stack Developer | DBA | GIS Specialist</p>
      </div>
    </div>
    </body></html>
    ";

    mail($email, "Thank you for contacting Makumbi George", $replyBody, $replyHeaders);

    echo json_encode(['success' => true, 'message' => "Thank you {$name}! Your message has been sent. I'll reply within 24 hours."]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to send message. Please email me directly at makumbigeorge@email.com.']);
}
