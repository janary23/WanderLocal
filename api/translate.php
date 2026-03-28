<?php
// api/translate.php
// Server-side proxy for Langbly API to bypass CORS restrictions
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, X-API-Key");
header("Access-Control-Allow-Methods: POST, OPTIONS");

// Return early for preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

// Read the incoming JSON data from the React app
$jsonInput = file_get_contents('php://input');
$data = json_decode($jsonInput, true);

if (!$data || !isset($data['q']) || !isset($data['target'])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid request. Need 'q' and 'target' fields."]);
    exit;
}

// Your Langbly API credentials
$API_KEY = 'USF6oU4kqXmiprHMVwQFY9';
$API_URL = 'https://api.langbly.com/language/translate/v2';

// Set up cURL to forward the request to Langbly
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $API_URL);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Handle SSL issues in local XAMPP
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'X-API-Key: ' . $API_KEY
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonInput);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curl_error = curl_error($ch);

if ($curl_error) {
    http_response_code(500);
    echo json_encode([
        "status" => "error", 
        "message" => "cURL failed: " . $curl_error,
        "details" => "Ensure your local server can reach api.langbly.com"
    ]);
} else if ($http_code >= 400) {
    http_response_code($http_code);
    echo $response; // Return Langbly's specific error message
} else {
    http_response_code($http_code);
    echo $response;
}

curl_close($ch);
?>
