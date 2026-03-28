<?php
require_once 'db.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

// We assume JSON body
$data = json_decode(file_get_contents("php://input"), true);
if (!$data || !isset($data['email']) || !isset($data['password']) || !isset($data['name']) || !isset($data['role'])) {
    echo json_encode(["status" => "error", "message" => "Missing fields."]);
    exit;
}

$name = $data['name'];
$email = $data['email'];
$password_plain = $data['password'];
$role = $data['role'];

try {
    // Check if email already exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = :email");
    $stmt->execute(['email' => $email]);
    if ($stmt->rowCount() > 0) {
        echo json_encode(["status" => "error", "message" => "Email already registered."]);
        exit;
    }

    $hashed_password = password_hash($password_plain, PASSWORD_DEFAULT);

    // Insert user
    $stmt = $pdo->prepare("INSERT INTO users (name, email, password, role) VALUES (:name, :email, :password, :role)");
    $stmt->execute([
        'name' => $name,
        'email' => $email,
        'password' => $hashed_password,
        'role' => $role
    ]);

    echo json_encode(["status" => "success", "message" => "Registration successful", "user" => [
        "name" => $name,
        "email" => $email,
        "role" => $role
    ]]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Registration error: " . $e->getMessage()]);
}
?>
