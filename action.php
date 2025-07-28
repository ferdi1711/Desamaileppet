<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

// ✅ Handle Preflight OPTIONS Request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
    header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');
    header('Access-Control-Allow-Credentials: true');
    http_response_code(200);
    exit();
}

// ✅ Global Headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');
header('Content-Type: application/json; charset=UTF-8');

// ✅ Koneksi Database
include "db_config.php";

// ✅ Ambil body request
$postjson = json_decode(file_get_contents('php://input'), true);
$aksi = isset($postjson['aksi']) ? strip_tags($postjson['aksi']) : null;

if (!$aksi) {
    echo json_encode(['success' => false, 'message' => 'Aksi tidak dikirim']);
    exit;
}

// ✅ SWITCH AKSI
switch ($aksi) {

    case "insert":
        $fields = [
            'nama_lengkap', 'nik', 'jenis_kelamin', 'tanggal_lahir',
            'alamat', 'status_pernikahan', 'pekerjaan', 'pendidikan_terakhir'
        ];
        $data = [];
        foreach ($fields as $field) {
            $data[$field] = trim($postjson[$field] ?? '');
        }

        if (empty($data['nama_lengkap']) || empty($data['nik'])) {
            echo json_encode(['success' => false, 'message' => 'Nama dan NIK wajib diisi']);
            break;
        }

        try {
            $stmt = $pdo->prepare("
                INSERT INTO warga (nama_lengkap, nik, jenis_kelamin, tanggal_lahir, alamat, status_pernikahan, pekerjaan, pendidikan_terakhir)
                VALUES (:nama_lengkap, :nik, :jenis_kelamin, :tanggal_lahir, :alamat, :status_pernikahan, :pekerjaan, :pendidikan_terakhir)
            ");
            $stmt->execute($data);
            echo json_encode(['success' => true, 'message' => 'Data berhasil ditambahkan.']);
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'message' => 'Gagal insert: ' . $e->getMessage()]);
        }
        break;

    case "getdata":
        try {
            $stmt = $pdo->query("SELECT * FROM warga ORDER BY id_warga DESC");
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(['success' => true, 'result' => $data]);
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'message' => 'Gagal mengambil data: ' . $e->getMessage()]);
        }
        break;

    case "delete":
        $id_warga = intval($postjson['id_warga'] ?? 0);
        if ($id_warga <= 0) {
            echo json_encode(['success' => false, 'message' => 'ID tidak valid']);
            break;
        }

        try {
            $stmt = $pdo->prepare("DELETE FROM warga WHERE id_warga = :id_warga");
            $stmt->execute([':id_warga' => $id_warga]);
            $deleted = $stmt->rowCount() > 0;
            echo json_encode([
                'success' => $deleted,
                'message' => $deleted ? 'Data berhasil dihapus.' : 'Data tidak ditemukan.'
            ]);
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'message' => 'Gagal menghapus: ' . $e->getMessage()]);
        }
        break;

    case "update":
        $id_warga = intval($postjson['id_warga'] ?? 0);
        if ($id_warga <= 0) {
            echo json_encode(['success' => false, 'message' => 'ID tidak valid']);
            break;
        }

        $fields = [
            'nama_lengkap', 'nik', 'jenis_kelamin', 'tanggal_lahir',
            'alamat', 'status_pernikahan', 'pekerjaan', 'pendidikan_terakhir'
        ];
        $data = [];
        foreach ($fields as $field) {
            $data[$field] = trim($postjson[$field] ?? '');
        }
        $data['id_warga'] = $id_warga;

        try {
            $stmt = $pdo->prepare("
                UPDATE warga SET
                    nama_lengkap = :nama_lengkap,
                    nik = :nik,
                    jenis_kelamin = :jenis_kelamin,
                    tanggal_lahir = :tanggal_lahir,
                    alamat = :alamat,
                    status_pernikahan = :status_pernikahan,
                    pekerjaan = :pekerjaan,
                    pendidikan_terakhir = :pendidikan_terakhir
                WHERE id_warga = :id_warga
            ");
            $stmt->execute($data);
            echo json_encode([
                'success' => true,
                'message' => $stmt->rowCount() > 0 ? 'Data berhasil diupdate.' : 'Data tidak berubah.'
            ]);
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'message' => 'Gagal update: ' . $e->getMessage()]);
        }
        break;

    case "login":
        $username = trim($postjson['username'] ?? '');
        $password = trim($postjson['password'] ?? '');

        if (!$username || !$password) {
            echo json_encode(['success' => false, 'message' => 'Username dan password wajib diisi']);
            break;
        }

        try {
            $stmt = $pdo->prepare("SELECT * FROM users WHERE username = :username LIMIT 1");
            $stmt->execute([':username' => $username]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user && $password === $user['password']) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Login berhasil',
                    'user' => ['id' => $user['id'], 'username' => $user['username']]
                ]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Username atau password salah']);
            }
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
        }
        break;

    case "statistik":
        try {
            $res = [];

            $res['total'] = (int) $pdo->query("SELECT COUNT(*) FROM warga")->fetchColumn();
            $res['laki'] = (int) $pdo->query("SELECT COUNT(*) FROM warga WHERE jenis_kelamin='Laki-laki'")->fetchColumn();
            $res['perempuan'] = (int) $pdo->query("SELECT COUNT(*) FROM warga WHERE jenis_kelamin='Perempuan'")->fetchColumn();
            $res['belumKawin'] = (int) $pdo->query("SELECT COUNT(*) FROM warga WHERE status_pernikahan='Belum Kawin'")->fetchColumn();

            echo json_encode(['success' => true] + $res);
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'message' => 'Gagal ambil statistik: ' . $e->getMessage()]);
        }
        break;

    case "get_statistik":
        try {
            $stmt = $pdo->query("SELECT jenis_kelamin, status_pernikahan, pendidikan_terakhir, pekerjaan FROM warga");
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(['success' => true, 'result' => $data]);
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'message' => 'Gagal ambil statistik detail: ' . $e->getMessage()]);
        }
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'Aksi tidak dikenali.']);
        break;
}
?>
