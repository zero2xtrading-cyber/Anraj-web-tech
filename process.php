<?php
/**
 * Zenith University Admissions Bureau - Backend Processor
 * Handles input sanitization, server validation, registration pass generation,
 * and dual output (JSON for AJAX and HTML fallback).
 */

date_default_timezone_set('Asia/Kolkata');

$isAjax = (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest')
          || (isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    if ($isAjax) {
        header('Content-Type: application/json; charset=UTF-8');
        http_response_code(405);
        echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
        exit;
    } else {
        header('Location: index.html');
        exit;
    }
}

function cleanInputStr($str) {
    if ($str === null) return '';
    return htmlspecialchars(stripslashes(trim($str)), ENT_QUOTES, 'UTF-8');
}

// Extract inputs
$candidateName   = cleanInputStr($_POST['candidateName'] ?? '');
$candidateEmail  = cleanInputStr($_POST['candidateEmail'] ?? '');
$candidatePhone  = cleanInputStr($_POST['candidatePhone'] ?? '');
$candidateDob    = cleanInputStr($_POST['candidateDob'] ?? '');
$candidateGender = cleanInputStr($_POST['candidateGender'] ?? '');
$targetCourse    = cleanInputStr($_POST['targetCourse'] ?? '');
$studyMode       = cleanInputStr($_POST['studyMode'] ?? '');
$qualExam        = cleanInputStr($_POST['qualExam'] ?? '');
$qualScore       = cleanInputStr($_POST['qualScore'] ?? '');
$homeAddress     = cleanInputStr($_POST['homeAddress'] ?? '');
$homeCity        = cleanInputStr($_POST['homeCity'] ?? '');
$postalZip       = cleanInputStr($_POST['postalZip'] ?? '');
$aspirations     = cleanInputStr($_POST['aspirations'] ?? '');
$attestBox       = isset($_POST['attestBox']);

// Server Validation
$errors = [];

if (empty($candidateName) || strlen($candidateName) < 3) {
    $errors['candidateName'] = 'Candidate name must be at least 3 characters.';
}
if (empty($candidateEmail) || !filter_var($candidateEmail, FILTER_VALIDATE_EMAIL)) {
    $errors['candidateEmail'] = 'Valid candidate email address is required.';
}
if (empty($candidatePhone) || !preg_match('/^[0-9]{10}$/', $candidatePhone)) {
    $errors['candidatePhone'] = 'Valid 10-digit primary mobile number required.';
}
if (empty($candidateDob)) {
    $errors['candidateDob'] = 'Date of birth is required.';
}
if (empty($candidateGender)) {
    $errors['candidateGender'] = 'Gender category is required.';
}
if (empty($targetCourse)) {
    $errors['targetCourse'] = 'Please select target engineering program.';
}
if (empty($studyMode)) {
    $errors['studyMode'] = 'Study mode preference is required.';
}
if (empty($qualExam)) {
    $errors['qualExam'] = 'Prior qualification is required.';
}
if (empty($qualScore)) {
    $errors['qualScore'] = 'Aggregate score is required.';
}
if (empty($homeAddress)) {
    $errors['homeAddress'] = 'Permanent address is required.';
}
if (empty($homeCity)) {
    $errors['homeCity'] = 'City is required.';
}
if (empty($postalZip) || !preg_match('/^[0-9]{6}$/', $postalZip)) {
    $errors['postalZip'] = 'Valid 6-digit postal PIN code required.';
}
if (!$attestBox) {
    $errors['attestBox'] = 'You must confirm the legal attestation.';
}

if (!empty($errors)) {
    if ($isAjax) {
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode([
            'status' => 'error',
            'message' => 'Validation error encountered in submitted form.',
            'errors' => $errors
        ]);
        exit;
    } else {
        echo "<!DOCTYPE html><html><head><title>Validation Errors</title><link rel='stylesheet' href='style.css'></head><body>";
        echo "<div class='content-frame' style='margin-top:3rem;'><div class='portal-frame'>";
        echo "<h2 style='color:#dc2626;'>Submission Incomplete</h2><ul>";
        foreach ($errors as $f => $m) {
            echo "<li><strong>" . htmlspecialchars($f) . ":</strong> " . htmlspecialchars($m) . "</li>";
        }
        echo "</ul><br><a href='index.html' class='btn-ctrl primary-btn'>Back to Form</a></div></div></body></html>";
        exit;
    }
}

// Generate Registration Number
$regId       = 'ZIAT-' . date('Y') . '-' . strtoupper(substr(uniqid(), -5));
$dateIssued  = date('d M Y');
$timestamp   = date('d M Y, h:i A');
$formattedDob = !empty($candidateDob) ? date('d M Y', strtotime($candidateDob)) : $candidateDob;

$dataPayload = [
    'regId'           => $regId,
    'dateIssued'      => $dateIssued,
    'timestamp'       => $timestamp,
    'candidateName'   => $candidateName,
    'candidateEmail'  => $candidateEmail,
    'candidatePhone'  => $candidatePhone,
    'candidateDob'    => $formattedDob,
    'candidateGender' => $candidateGender,
    'targetCourse'    => $targetCourse,
    'studyMode'       => $studyMode,
    'qualExam'        => $qualExam,
    'qualScore'       => $qualScore,
    'homeAddress'     => $homeAddress,
    'homeCity'        => $homeCity,
    'postalZip'       => $postalZip,
    'aspirations'     => $aspirations
];

if ($isAjax) {
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode([
        'status'  => 'success',
        'message' => 'Candidate application registered successfully.',
        'data'    => $dataPayload
    ]);
    exit;
}

// Fallback HTML Output
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Provisional Slip - <?php echo $regId; ?></title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Lexend:wght@600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header class="masthead no-print">
    <div class="masthead-content">
      <div class="brand-unit">
        <div class="brand-emblem"><i class="fa-solid fa-atom"></i></div>
        <div class="brand-text-block">
          <h1 class="brand-name">ZENITH UNIVERSITY</h1>
          <span class="brand-sub">Institute of Advanced Technology & Engineering</span>
        </div>
      </div>
    </div>
  </header>

  <main class="viewport-shell">
    <div class="content-frame">
      <section class="portal-frame">
        <div class="confirmation-banner no-print">
          <div class="banner-badge"><i class="fa-solid fa-circle-check"></i></div>
          <div>
            <h3>Application Accepted & Registered!</h3>
            <p>Your enrollment credentials have been recorded by the server.</p>
          </div>
        </div>

        <div class="dossier-paper">
          <div class="dossier-header">
            <div class="dossier-crest">
              <div class="crest-frame"><i class="fa-solid fa-atom"></i></div>
              <div class="dossier-titles">
                <h2>ZENITH UNIVERSITY OF ADVANCED TECHNOLOGY</h2>
                <p>Office of the Board of Admissions & Directorate of Academic Affairs</p>
                <span class="dossier-badge">OFFICIAL CANDIDATE PROVISIONAL PASS</span>
              </div>
            </div>
            <div class="dossier-meta">
              <div class="ref-container">
                <span class="ref-title">REGISTRATION ID</span>
                <span class="ref-number"><?php echo $regId; ?></span>
              </div>
              <div class="meta-date">Date Issued: <strong><?php echo $dateIssued; ?></strong></div>
            </div>
          </div>

          <div class="dossier-divider"></div>

          <div class="dossier-grid">
            <div class="dossier-field">
              <span class="field-label"><i class="fa-regular fa-user"></i> Applicant Name</span>
              <span class="field-data highlight-crimson"><?php echo $candidateName; ?></span>
            </div>
            <div class="dossier-field">
              <span class="field-label"><i class="fa-regular fa-envelope"></i> Email Identifier</span>
              <span class="field-data"><?php echo $candidateEmail; ?></span>
            </div>
            <div class="dossier-field">
              <span class="field-label"><i class="fa-solid fa-phone"></i> Mobile Contact</span>
              <span class="field-data"><?php echo $candidatePhone; ?></span>
            </div>
            <div class="dossier-field">
              <span class="field-label"><i class="fa-regular fa-calendar"></i> Date of Birth & Gender</span>
              <span class="field-data"><?php echo $formattedDob . ' (' . $candidateGender . ')'; ?></span>
            </div>
            <div class="dossier-field wide-field">
              <span class="field-label"><i class="fa-solid fa-laptop-code"></i> Admitted Academic Stream</span>
              <span class="field-data highlight-navy"><?php echo $targetCourse; ?></span>
            </div>
            <div class="dossier-field">
              <span class="field-label"><i class="fa-solid fa-chalkboard-user"></i> Study Mode</span>
              <span class="field-data"><?php echo $studyMode; ?></span>
            </div>
            <div class="dossier-field">
              <span class="field-label"><i class="fa-solid fa-chart-simple"></i> Prior Qualification & Score</span>
              <span class="field-data"><?php echo $qualExam . ' [' . $qualScore . ']'; ?></span>
            </div>
            <div class="dossier-field wide-field">
              <span class="field-label"><i class="fa-solid fa-house-chimney"></i> Residential Address</span>
              <span class="field-data"><?php echo $homeAddress . ', ' . $homeCity . ' - ' . $postalZip; ?></span>
            </div>
            <?php if (!empty($aspirations)): ?>
            <div class="dossier-field wide-field">
              <span class="field-label"><i class="fa-regular fa-comment-dots"></i> Statement of Purpose</span>
              <span class="field-data italic-note">"<?php echo $aspirations; ?>"</span>
            </div>
            <?php endif; ?>
          </div>

          <div class="dossier-footer">
            <div class="security-stamp">
              <i class="fa-solid fa-certificate"></i>
              <div>
                <strong>UNIVERSITY VALIDATED</strong>
                <p>System Timestamp: <?php echo $timestamp; ?></p>
              </div>
            </div>
            <div class="officer-signature">
              <div class="line-holder"></div>
              <span>Controller of Admissions & Registrar</span>
            </div>
          </div>
        </div>

        <div class="dossier-actions no-print">
          <button type="button" onclick="window.print()" class="btn-ctrl primary-btn">
            <i class="fa-solid fa-print"></i> Print Slip / Save PDF
          </button>
          <a href="index.html" class="btn-ctrl secondary-btn">
            <i class="fa-solid fa-plus"></i> Submit Another Application
          </a>
        </div>
      </section>
    </div>
  </main>
</body>
</html>
