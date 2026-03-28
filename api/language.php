<?php
// api/language.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$lang = $_GET['lang'] ?? 'en';
$langDir = __DIR__ . '/lang/';
$langFile = $langDir . basename($lang) . '.json';
$defaultFile = $langDir . 'en.json';

if (file_exists($langFile)) {
    $json = file_get_contents($langFile);
    echo $json;
} elseif (file_exists($defaultFile)) {
    echo file_get_contents($defaultFile);
} else {
    echo json_encode(["error" => "No translation found."]);
}
