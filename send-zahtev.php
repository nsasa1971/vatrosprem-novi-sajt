<?php
/**
 * send-zahtev.php
 * Prima JSON podatke sa obrasca "Zahtev za usluge kontrolisanja" (POST)
 * i šalje ih na boban.inovacije@gmail.com.
 *
 * POSTAVLJANJE:
 * 1) Ubacite ovaj fajl u isti folder kao i zahtev-za-kontrolisanje.html na hostingu
 *    (vatrospremdoo.rs / Hostinger).
 * 2) Ako sajt već ima PHPMailer/SMTP podešen za glavni kontakt formular, PREPORUČENO je
 *    da ovaj fajl koristi ISTI mehanizam (pouzdanije od gole mail() funkcije, manji rizik
 *    da mejl završi u spam folderu). Ispod je varijanta sa PHPMailer (SMTP) — samo upišite
 *    iste SMTP podatke koje već koristite (Hostinger Email Hosting), po mogućstvu kroz
 *    environment varijable, ne hardkodovano u kodu.
 * 3) Ako nemate PHPMailer, ostavite fallback na ugrađenu mail() funkciju ispod —
 *    radiće, ali proverite da li stiže u inbox ili u spam.
 */

header('Content-Type: application/json; charset=utf-8');

// Dozvoli samo POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'method_not_allowed']);
    exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'invalid_payload']);
    exit;
}

// --- Osnovna server-side validacija (ne oslanjati se samo na front-end) ---
$required = ['korisnikNaziv', 'korisnikAdresa', 'kontaktOsoba', 'telefon', 'email', 'objekatNaziv', 'objekatAdresa'];
foreach ($required as $field) {
    if (empty(trim($data[$field] ?? ''))) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'missing_field', 'field' => $field]);
        exit;
    }
}
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'invalid_email']);
    exit;
}
if (empty($data['usluge']) || !is_array($data['usluge'])) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'no_services']);
    exit;
}

function h($v) {
    return htmlspecialchars((string)$v, ENT_QUOTES, 'UTF-8');
}

// --- Formatiranje sadržaja mejla ---
$lines = [];
$lines[] = "ZAHTEV ZA USLUGE KONTROLISANJA";
$lines[] = "";
$lines[] = "PODACI O KORISNIKU";
$lines[] = "Naziv korisnika: " . $data['korisnikNaziv'];
if (!empty($data['korisnikPib'])) $lines[] = "PIB / matični broj: " . $data['korisnikPib'];
$lines[] = "Adresa korisnika: " . $data['korisnikAdresa'];
$lines[] = "Kontakt osoba: " . $data['kontaktOsoba'];
$lines[] = "Telefon: " . $data['telefon'];
$lines[] = "E-mail: " . $data['email'];
$lines[] = "";
$lines[] = "PODACI O OBJEKTU";
$lines[] = "Naziv objekta: " . $data['objekatNaziv'];
$lines[] = "Adresa objekta: " . $data['objekatAdresa'];
if (!empty($data['objekatLokacija'])) $lines[] = "Lokacija / deo objekta: " . $data['objekatLokacija'];
$lines[] = "";
$lines[] = "ZAHTEVANE USLUGE";
foreach ($data['usluge'] as $u) {
    $opis = "[" . $u['oznaka'] . "] " . $u['opis'];
    if (!empty($u['kolicine'])) {
        $kol = [];
        foreach ($u['kolicine'] as $k => $v) {
            $kol[] = $k . ': ' . $v;
        }
        $opis .= " — " . implode(', ', $kol);
    }
    $lines[] = $opis;
}
$lines[] = "";
$lines[] = "Datum: " . ($data['datum'] ?? '');
$lines[] = "Podnosilac zahteva: " . ($data['podnosilac'] ?? '—');

$body = implode("\n", $lines);
$to = 'boban.inovacije@gmail.com';
$subject = 'Zahtev za usluge kontrolisanja — ' . $data['korisnikNaziv'];

$sent = false;

// ====================================================================
// OPCIJA A (preporučeno) — PHPMailer preko SMTP-a (Hostinger Email Hosting)
// Otkomentarišite i popunite ako već koristite PHPMailer na sajtu.
// ====================================================================
/*
require __DIR__ . '/vendor/autoload.php'; // putanja do PHPMailer-a
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

try {
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host       = getenv('SMTP_HOST');       // npr. smtp.hostinger.com
    $mail->SMTPAuth   = true;
    $mail->Username   = getenv('SMTP_USER');       // npr. inovacije@vatrospremdoo.rs
    $mail->Password   = getenv('SMTP_PASS');
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;
    $mail->CharSet    = 'UTF-8';

    $mail->setFrom(getenv('SMTP_USER'), 'Vatrosprem Inovacije — Sajt');
    $mail->addAddress($to);
    $mail->addReplyTo($data['email'], $data['kontaktOsoba']);

    $mail->Subject = $subject;
    $mail->Body    = $body;

    $mail->send();
    $sent = true;
} catch (Exception $e) {
    error_log('PHPMailer greška: ' . $mail->ErrorInfo);
}
*/

// ====================================================================
// OPCIJA B (fallback) — ugrađena mail() funkcija
// ====================================================================
if (!$sent) {
    $headers = [];
    $headers[] = 'From: Vatrosprem Inovacije — Sajt <no-reply@vatrospremdoo.rs>';
    $headers[] = 'Reply-To: ' . $data['kontaktOsoba'] . ' <' . $data['email'] . '>';
    $headers[] = 'Content-Type: text/plain; charset=UTF-8';

    $sent = mail($to, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, implode("\r\n", $headers));
}

if ($sent) {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'send_failed']);
}
