<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $usernameOrEmail = htmlspecialchars($_POST['uname']);
    $password = htmlspecialchars($_POST['psw']);

    $stmt = $conn->prepare("SELECT id, password FROM users WHERE username = ? OR email = ?");
    $stmt->bind_param("ss", $usernameOrEmail, $usernameOrEmail);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($id, $hashed_password);
        $stmt->fetch();

        if (password_verify($password, $hashed_password)) {
            session_start();
            $_SESSION['user_id'] = $id;
            header("Location: dashboard.php");
            exit();
        } else {
            echo '<script>
                alert("Invalid username, email, or password.");
                window.location.href="login.html";
            </script>';
        }
    } else {
        echo '<script>
            alert("This account has not been found.");
            window.location.href="login.html";
        </script>';
    }

    $stmt->close();
    $conn->close();
}
?>
