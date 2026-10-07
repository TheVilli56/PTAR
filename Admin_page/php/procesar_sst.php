<?php
// Incluir el archivo de conexión
require_once '../config/conexion.php';

header('Content-Type: application/json');

$response = [
    'success' => false,
    'mensaje' => 'Error desconocido.'
];

if (!isset($_POST['accion'])) {
    $response['mensaje'] = 'Acción no especificada.';
    echo json_encode($response);
    exit;
}

$accion = $_POST['accion'];

// --- FUNCIONALIDAD DE REGISTRO (INSERT) ---
if ($accion === 'registrar') {
    // 1. Obtener y validar datos comunes
    $id_usuario = $_POST['id_usuario'] ?? null;
    $fecha = $_POST['fecha'] ?? null;
    $hora = $_POST['hora'] ?? null;

    if (empty($id_usuario) || empty($fecha) || empty($hora)) {
        $response['mensaje'] = 'Faltan campos comunes requeridos (Responsable, Fecha, Hora).';
        echo json_encode($response);
        exit;
    }

    // 2. Iniciar transacción e Insertar en TEC-01 (para obtener el reg AUTO_INCREMENT)
    $conn->begin_transaction();
    try {
        // TEC-01
        // Nueva estructura: (fecha, hora, id_usuario, nivel, ph, dqo, t)
        $stmt_tec01 = $conn->prepare("INSERT INTO tec01 (fecha, hora, id_usuario, nivel, ph, dqo, t) VALUES (?, ?, ?, ?, ?, ?, ?)");
        
        $tec01_nivel = $_POST['tec01_nivel'] ?? null;
        $tec01_ph = $_POST['tec01_ph'] ?? null;
        $tec01_dqo = $_POST['tec01_dqo'] ?? null;
        $tec01_t = $_POST['tec01_t'] ?? null;
        
        // El formato de tipos es: s, s (fecha, hora), i (id_usuario), dddd (nivel, ph, dqo, t)
        $stmt_tec01->bind_param("sisdddd", $fecha, $hora, $id_usuario, $tec01_nivel, $tec01_ph, $tec01_dqo, $tec01_t);
        
        if (!$stmt_tec01->execute()) {
            throw new Exception("Error al insertar en TEC-01: " . $stmt_tec01->error);
        }

        $reg_id = $conn->insert_id; // Obtener el ID que se usará en las demás tablas
        $tipo_registro = "SST";

        // 3. Insertar en las otras tablas usando el $reg_id y el $id_usuario
        
        // RAC
        // Nueva estructura: (reg, fecha, hora, id_usuario, ddq, ph, t)
        $stmt_rac = $conn->prepare("INSERT INTO rac (reg, fecha, hora, id_usuario, ddq, ph, t) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $rac_dqo = $_POST['rac_dqo'] ?? null; // ddq en rac
        $rac_ph = $_POST['rac_ph'] ?? null;
        $rac_t = $_POST['rac_t'] ?? null;
        // El formato de tipos es: i (reg), ss (fecha, hora), i (id_usuario), ddd (ddq, ph, t)
        if (!$stmt_rac->bind_param("issiddd", $reg_id, $fecha, $hora, $id_usuario, $rac_dqo, $rac_ph, $rac_t) || !$stmt_rac->execute()) {
            throw new Exception("Error al insertar en RAC: " . $stmt_rac->error);
        }

        // REC-01
        // Nueva estructura: (reg, fecha, hora, id_usuario, ssed, od, ph, t)
        $stmt_rec01 = $conn->prepare("INSERT INTO rec01 (reg, fecha, hora, id_usuario, ssed, od, ph, t) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $rec01_ssed = $_POST['rec01_ssed'] ?? null;
        $rec01_od = $_POST['rec01_od'] ?? null;
        $rec01_ph = $_POST['rec01_ph'] ?? null;
        $rec01_t = $_POST['rec01_t'] ?? null;
        // El formato de tipos es: i (reg), ss (fecha, hora), i (id_usuario), dddd (ssed, od, ph, t)
        if (!$stmt_rec01->bind_param("issidddd", $reg_id, $fecha, $hora, $id_usuario, $rec01_ssed, $rec01_od, $rec01_ph, $rec01_t) || !$stmt_rec01->execute()) {
            throw new Exception("Error al insertar en REC-01: " . $stmt_rec01->error);
        }

        // CSC
        // Nueva estructura: (reg, fecha, hora, id_usuario, ddq, ph, t)
        $stmt_csc = $conn->prepare("INSERT INTO csc (reg, fecha, hora, id_usuario, ddq, ph, t) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $csc_dqo = $_POST['csc_dqo'] ?? null; // ddq en csc
        $csc_ph = $_POST['csc_ph'] ?? null;
        $csc_t = $_POST['csc_t'] ?? null;
        // El formato de tipos es: i (reg), ss (fecha, hora), i (id_usuario), ddd (ddq, ph, t)
        if (!$stmt_csc->bind_param("issiddd", $reg_id, $fecha, $hora, $id_usuario, $csc_dqo, $csc_ph, $csc_t) || !$stmt_csc->execute()) {
            throw new Exception("Error al insertar en CSC: " . $stmt_csc->error);
        }
        $conn->commit();
        $response['success'] = true;
        $response['mensaje'] = 'Datos de muestreo registrados correctamente con REG: ' . $reg_id;

    } catch (Exception $e) {
        $conn->rollback();
        $response['mensaje'] = 'Fallo en la transacción de registro: ' . $e->getMessage();
    }
} elseif ($accion === 'eliminar') {
    $reg = $_POST['id_eliminar'] ?? null;
    $tabla = $_POST['tabla_eliminar'] ?? null;

    if (!$reg || !$tabla) {
        $response['mensaje'] = 'Faltan el ID de Registro (reg) o la Tabla a eliminar.';
        echo json_encode($response);
        exit;
    }
    
    // Lista de tablas de muestreo a las que se les aplicará la eliminación en cascada
    $tablas_muestreo = ['csc', 'rac', 'rec01', 'tec01'];

    // Para la eliminación, es más seguro eliminar el registro maestro, 
    // y si las otras tablas tienen la misma clave foránea con ON DELETE CASCADE, 
    // se eliminan automáticamente. Si no lo tienen, debemos eliminarlas manualmente.
    
    $conn->begin_transaction();
    try {
        $error_messages = [];

        // Eliminar de las tablas de muestreo. Es crucial que se eliminen de TODAS
        // ya que comparten el mismo ID 'reg'. No importa qué tabla se seleccione en el filtro.
        foreach ($tablas_muestreo as $t) {
            $stmt = $conn->prepare("DELETE FROM $t WHERE reg = ?");
            if (!$stmt) {
                 throw new Exception("Error preparando la consulta DELETE para $t: " . $conn->error);
            }
            $stmt->bind_param("i", $reg);
            if (!$stmt->execute()) {
                $error_messages[] = "Error al eliminar en $t: " . $stmt->error;
            }
            $stmt->close();
        }

        if (!empty($error_messages)) {
             throw new Exception("Errores en la eliminación de algunas tablas: " . implode(" | ", $error_messages));
        }

        $conn->commit();
        $response['success'] = true;
        $response['mensaje'] = "Registro $reg eliminado correctamente de todas las tablas de muestreo.";

    } catch (Exception $e) {
        $conn->rollback();
        $response['mensaje'] = 'Fallo en la transacción de eliminación: ' . $e->getMessage();
    }

// --- FUNCIONALIDAD DE OBTENER REGISTRO PARA MODIFICAR (SELECT) ---
} elseif ($accion === 'obtener_registro') {
    $reg = $_POST['reg'] ?? null;
    $tabla = $_POST['tabla'] ?? null;

    if (!$reg || !$tabla) {
        $response['mensaje'] = 'Faltan el ID de Registro (reg) o la Tabla para obtener.';
        echo json_encode($response);
        exit;
    }

    // Consulta segura
    $stmt = $conn->prepare("SELECT * FROM $tabla WHERE reg = ?");
    if (!$stmt) {
        $response['mensaje'] = "Error preparando la consulta SELECT: " . $conn->error;
        echo json_encode($response);
        exit;
    }
    $stmt->bind_param("i", $reg);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $response['success'] = true;
        $response['mensaje'] = 'Registro obtenido con éxito.';
        // Solo necesitamos el primer (y único) registro
        $response['registro'] = $result->fetch_assoc(); 
    } else {
        $response['mensaje'] = 'Registro no encontrado.';
    }
    $stmt->close();

// --- FUNCIONALIDAD DE MODIFICAR REGISTRO (UPDATE) ---
} elseif ($accion === 'modificar') {
    $reg = $_POST['reg'] ?? null;
    $tabla = $_POST['tabla'] ?? null;

    if (!$reg || !$tabla) {
        $response['mensaje'] = 'Faltan el ID de Registro (reg) o la Tabla para modificar.';
        echo json_encode($response);
        exit;
    }

    // Construir la consulta de UPDATE dinámicamente
    $set_clauses = [];
    $types = '';
    $params = [];

    // Recorrer todos los campos recibidos, excepto 'accion', 'reg', 'tabla'
    foreach ($_POST as $key => $value) {
        if ($key !== 'accion' && $key !== 'reg' && $key !== 'tabla') {
            $set_clauses[] = "`$key` = ?";
            // Determinar el tipo para bind_param (simplificado: 's' para string, 'd' para double/float, 'i' para int si es necesario)
            if ($key === 'fecha' || $key === 'hora') {
                $types .= 's';
            } else {
                 $types .= 'd'; // Asumimos numérico (double/float) para el resto de parámetros
            }
            $params[] = ($value !== '') ? $value : null; // Guardar valor, usar null si está vacío
        }
    }
    
    // No hay campos a actualizar
    if (empty($set_clauses)) {
        $response['mensaje'] = 'No se encontraron campos para modificar.';
        echo json_encode($response);
        exit;
    }

    $set_string = implode(', ', $set_clauses);
    $sql = "UPDATE $tabla SET $set_string WHERE reg = ?";

    $conn->begin_transaction();
    try {
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
             throw new Exception("Error preparando la consulta UPDATE: " . $conn->error);
        }

        // Agregar el ID de registro al final de los parámetros para el WHERE
        $types .= 'i';
        $params[] = $reg;
        
        // Crear array de referencias para bind_param
        $bind_params = array_merge([$types], $params);
        $refs = [];
        foreach($bind_params as $key => $value) {
            $refs[$key] = &$bind_params[$key];
        }

        // Llamar a bind_param dinámicamente
        call_user_func_array([$stmt, 'bind_param'], $refs);

        if (!$stmt->execute()) {
             throw new Exception("Error al ejecutar UPDATE: " . $stmt->error);
        }

        $conn->commit();
        $response['success'] = true;
        $response['mensaje'] = "Registro $reg de $tabla modificado correctamente.";

    } catch (Exception $e) {
        $conn->rollback();
        $response['mensaje'] = 'Fallo en la transacción de modificación: ' . $e->getMessage();
    }
}

echo json_encode($response);
$conn->close();
?>