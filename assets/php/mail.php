<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method.'
    ]);
    exit;
}

function field_value($key) {
    return isset($_POST[$key]) ? trim((string) $_POST[$key]) : '';
}

function clean_header($value) {
    return str_replace(["\r", "\n"], '', $value);
}

$name = field_value('name');
$email = field_value('email');
$phone = field_value('phone');
$subject = field_value('subject');
$message = field_value('message');

if ($name === '' || $email === '' || $phone === '' || $subject === '' || $message === '') {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Please complete all required fields.'
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Please enter a valid email address.'
    ]);
    exit;
}

$to = 'corporate@viskez.com';
$safeSubject = clean_header($subject);
$safeName = clean_header($name);
$safeEmail = clean_header($email);

$emailSubject = 'Website enquiry: ' . $safeSubject;
$emailBody = implode("\n", [
    'Name: ' . $name,
    'Email: ' . $email,
    'Phone: ' . $phone,
    'Subject: ' . $subject,
    '',
    'Message:',
    $message
]);

$headers = [
    'From: VISKEZ Website <corporate@viskez.com>',
    'Reply-To: ' . $safeName . ' <' . $safeEmail . '>',
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PHP/' . phpversion()
];

$sent = mail($to, $emailSubject, $emailBody, implode("\r\n", $headers));

if (!$sent) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Unable to send message. Please try again later.'
    ]);
    exit;
}

echo json_encode([
    'success' => true,
    'message' => 'Message sent successfully.'
]);
