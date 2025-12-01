<?php
class DataBase {

    private $host = "localhost";
    private $dbname = "midas_db";
    private $user = "root";
    private $pass = "";
    public $conexion;

    public function __construct() {
        try {
            $this->conexion = new PDO(
                "mysql:host={$this->host};dbname={$this->dbname};charset=utf8mb4",
                $this->user,
                $this->pass,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false
                ]
            );
        } catch (PDOException $e) {
            die("Error de conexión: " . $e->getMessage());
        }
    }


    // Ejecutar INSERT, UPDATE, DELETE
    public function ejecutar($sql, $parametros = []) {
        $stmt = $this->conexion->prepare($sql);

        foreach ($parametros as $key => $value) {
            if (is_int($key)) {
                $stmt->bindValue($key + 1, $value);
            } else {
                $stmt->bindValue($key, $value);
            }
        }

        $stmt->execute();
        return $stmt;
    }


    // Consultar datos (SELECT)
    public function consultar($sql, $parametros = []) {
        $stmt = $this->conexion->prepare($sql);

        foreach ($parametros as $key => $value) {
            if (is_int($key)) {
                $stmt->bindValue($key + 1, $value);
            } else {
                $stmt->bindValue($key, $value);
            }
        }

        $stmt->execute();
        $resultado = $stmt->fetchAll();
        $stmt = null;

        return $resultado;
    }

}
?>


