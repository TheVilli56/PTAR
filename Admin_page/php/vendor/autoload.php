<?php
header('Content-Type: application/json');

require_once '../../config/conexion.php';

// Si usas PhpSpreadsheet para Excel, descomenta la siguiente línea:
// require_once '../../vendor/autoload.php';
// use PhpOffice\PhpSpreadsheet\IOFactory;

$response = ['success' => false, 'error' => null, 'inserted_rows' => 0];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $tabla = $_POST['tabla'] ?? '';

    if (empty($tabla)) {
        $response['error'] = 'Tabla es requerida.';
        echo json_encode($response);
        exit;
    }

    $allowedTables = ['registro_operacion', 'flujos', 'registro_riegos'];
    if (!in_array($tabla, $allowedTables)) {
        $response['error'] = 'Tabla no permitida.';
        echo json_encode($response);
        exit;
    }

    if (!isset($_FILES['archivo']) || $_FILES['archivo']['error'] !== UPLOAD_ERR_OK) {
        $response['error'] = 'No se ha subido ningún archivo o hubo un error en la subida.';
        echo json_encode($response);
        exit;
    }

    $fileTmpPath = $_FILES['archivo']['tmp_name'];
    $fileName = $_FILES['archivo']['name'];
    $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

    $supportedExtensions = ['csv', 'xls', 'xlsx'];
    if (!in_array($fileExtension, $supportedExtensions)) {
        $response['error'] = 'Formato de archivo no soportado. Por favor, sube un archivo CSV o Excel.';
        echo json_encode($response);
        exit;
    }

    $insertedRows = 0;
    $errors = [];

    try {
        // Obtener las columnas de la tabla de la base de datos para mapeo
        // Esto es crucial para saber qué columnas aceptar y en qué orden (si no hay cabeceras)
        // O para validar que las cabeceras del archivo coinciden con las de la tabla
        $stmtColumns = $conn->prepare("SHOW COLUMNS FROM `" . $tabla . "`");
        $stmtColumns->execute();
        $resultColumns = $stmtColumns->get_result();
        $dbColumns = [];
        $dbColumnTypes = [];
        while ($row = $resultColumns->fetch_assoc()) {
            // Ignorar IDs autoincrementables si no se espera que el CSV los contenga
            if (strpos($row['Extra'], 'auto_increment') === false) {
                 $dbColumns[] = $row['Field'];
                 $dbColumnTypes[$row['Field']] = $row['Type'];
            }
        }
        $stmtColumns->close();

        if (empty($dbColumns)) {
            throw new Exception("No se pudieron obtener las columnas de la tabla '$tabla'.");
        }

        if ($fileExtension === 'csv') {
            if (($handle = fopen($fileTmpPath, "r")) !== FALSE) {
                $header = fgetcsv($handle, 1000, ","); // Leer la primera fila como cabecera

                // Mapear las cabeceras del CSV a las columnas de la DB
                $csvToDbColumns = [];
                foreach ($header as $csvCol) {
                    $cleanedCsvCol = trim(strtolower($csvCol)); // Limpiar espacios y minúsculas
                    foreach ($dbColumns as $dbCol) {
                        if (trim(strtolower($dbCol)) === $cleanedCsvCol) {
                            $csvToDbColumns[$csvCol] = $dbCol;
                            break;
                        }
                    }
                }
                
                // Verificar que todas las columnas de la DB esperadas estén en el CSV
                // o que al menos las columnas del CSV sean válidas para la DB
                $insertColumns = [];
                $placeholders = [];
                foreach($header as $csvHeaderName) {
                    if (isset($csvToDbColumns[$csvHeaderName])) {
                        $insertColumns[] = "`" . $csvToDbColumns[$csvHeaderName] . "`";
                        $placeholders[] = "?";
                    } else {
                        // Opcional: Ignorar columnas en el CSV que no están en la DB,
                        // o lanzar un error si una columna desconocida es crítica.
                        // throw new Exception("Columna '" . $csvHeaderName . "' del CSV no encontrada en la tabla '$tabla'.");
                        error_log("Advertencia: Columna '" . $csvHeaderName . "' en el CSV no mapeada a la tabla '$tabla'.");
                    }
                }

                if (empty($insertColumns)) {
                    throw new Exception("No se encontraron columnas válidas para insertar en la tabla '$tabla' desde el CSV.");
                }

                $sqlInsert = "INSERT INTO `" . $tabla . "` (" . implode(", ", $insertColumns) . ") VALUES (" . implode(", ", $placeholders) . ")";
                $stmt = $conn->prepare($sqlInsert);

                if ($stmt === false) {
                    throw new Exception('Error al preparar la consulta de inserción: ' . $conn->error);
                }

                $rowNum = 1; // Para mensajes de error
                while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
                    $rowNum++;
                    $bindTypes = "";
                    $bindValues = [];
                    
                    // Asegurarse de que el número de columnas coincida
                    if (count($data) !== count($header)) {
                         $errors[] = "La fila $rowNum no tiene el número de columnas esperado.";
                         continue;
                    }

                    foreach ($header as $colIndex => $csvHeaderName) {
                        if (isset($csvToDbColumns[$csvHeaderName])) {
                            $dbColName = $csvToDbColumns[$csvHeaderName];
                            $value = $data[$colIndex];
                            // Aquí podrías añadir lógica para convertir tipos de datos si es necesario
                            // Por ejemplo, para fechas, números, etc.
                            // Para simplificar, asumimos todos como strings y MySQL los convertirá si es posible.
                            $bindTypes .= "s";
                            $bindValues[] = $value;
                        }
                    }

                    if (empty($bindValues)) { // Si después de filtrar no hay valores para insertar
                        continue;
                    }

                    call_user_func_array([$stmt, 'bind_param'], refValues(array_merge([$bindTypes], $bindValues)));

                    if ($stmt->execute()) {
                        $insertedRows++;
                    } else {
                        $errors[] = "Error al insertar la fila $rowNum: " . $stmt->error;
                    }
                }
                fclose($handle);
            } else {
                throw new Exception("Error al abrir el archivo CSV.");
            }
        } elseif ($fileExtension === 'xls' || $fileExtension === 'xlsx') {
            // Lógica para Excel usando PhpSpreadsheet
            // Descomenta y adapta si tienes PhpSpreadsheet instalado y configurado
            /*
            $spreadsheet = IOFactory::load($fileTmpPath);
            $sheet = $spreadsheet->getActiveSheet();
            $highestRow = $sheet->getHighestRow();
            $highestColumn = $sheet->getHighestColumn(); // E.g. 'F'

            $header = [];
            $headerRowData = $sheet->rangeToArray('A1:' . $highestColumn . '1', NULL, TRUE, FALSE)[0];
            foreach($headerRowData as $col) {
                $header[] = $col;
            }

            // Mapear cabeceras Excel a columnas DB (similar a CSV)
            $excelToDbColumns = [];
            foreach ($header as $excelCol) {
                $cleanedExcelCol = trim(strtolower($excelCol));
                foreach ($dbColumns as $dbCol) {
                    if (trim(strtolower($dbCol)) === $cleanedExcelCol) {
                        $excelToDbColumns[$excelCol] = $dbCol;
                        break;
                    }
                }
            }

            $insertColumns = [];
            $placeholders = [];
            foreach($header as $excelHeaderName) {
                if (isset($excelToDbColumns[$excelHeaderName])) {
                    $insertColumns[] = "`" . $excelToDbColumns[$excelHeaderName] . "`";
                    $placeholders[] = "?";
                }
            }

            if (empty($insertColumns)) {
                throw new Exception("No se encontraron columnas válidas para insertar en la tabla '$tabla' desde el archivo Excel.");
            }

            $sqlInsert = "INSERT INTO `" . $tabla . "` (" . implode(", ", $insertColumns) . ") VALUES (" . implode(", ", $placeholders) . ")";
            $stmt = $conn->prepare($sqlInsert);
            if ($stmt === false) {
                throw new Exception('Error al preparar la consulta de inserción: ' . $conn->error);
            }

            for ($row = 2; $row <= $highestRow; $row++) { // Empezar desde la segunda fila (después de la cabecera)
                $rowData = $sheet->rangeToArray('A' . $row . ':' . $highestColumn . $row, NULL, TRUE, FALSE)[0];

                if (empty(array_filter($rowData))) { // Saltar filas vacías
                    continue;
                }

                $bindTypes = "";
                $bindValues = [];

                foreach ($header as $colIndex => $excelHeaderName) {
                    if (isset($excelToDbColumns[$excelHeaderName])) {
                        $dbColName = $excelToDbColumns[$excelHeaderName];
                        $value = $rowData[$colIndex] ?? ''; // Usar un valor vacío si la celda no existe
                        $bindTypes .= "s";
                        $bindValues[] = $value;
                    }
                }

                if (empty($bindValues)) {
                    continue;
                }

                call_user_func_array([$stmt, 'bind_param'], refValues(array_merge([$bindTypes], $bindValues)));

                if ($stmt->execute()) {
                    $insertedRows++;
                } else {
                    $errors[] = "Error al insertar la fila $row: " . $stmt->error;
                }
            }
            */
            throw new Exception("El soporte para Excel no está implementado en este ejemplo sin PhpSpreadsheet.");
        }

        if (empty($errors)) {
            $response['success'] = true;
            $response['inserted_rows'] = $insertedRows;
        } else {
            $response['error'] = 'Errores durante la carga: ' . implode('; ', $errors);
        }

    } catch (Exception $e) {
        $response['error'] = $e->getMessage();
    } finally {
        $conn->close();
    }

} else {
    $response['error'] = 'Método de solicitud no permitido.';
}

echo json_encode($response);

// Helper function to pass parameters by reference for bind_param
function refValues($arr){
    if (strnatcmp(phpversion(),'5.3') >= 0) // PHP 5.3+
    {
        $refs = array();
        foreach($arr as $key => $value)
            $refs[$key] = &$arr[$key];
        return $refs;
    }
    return $arr;
}
?>