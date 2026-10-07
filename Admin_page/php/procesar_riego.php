<?php
header('Content-Type: application/json');
require_once '../config/conexion.php';

$response = ['success' => false, 'mensaje' => ''];

$accion = $_POST['accion'] ?? '';
$id = $_POST['id'] ?? null; // Usaremos 'id' para obtener, modificar y eliminar desde la tabla/modal

// ==============================================================================
// 1. ACCIÓN: REGISTRAR (Mantenida y validada)
// ==============================================================================
if ($accion === 'registrar') {
    // Recoger los datos del formulario (la validación de campos obligatorios debe estar en JS)
    $fecha = $_POST['fecha'] ?? null;
    $hora_inicio = $_POST['hora_inicio'] ?? null;
    $hora_termino = $_POST['hora_termino'] ?? null;
    $id_zona = $_POST['id_zona'] ?? null;
    $bomba_presion_bcm_01a = $_POST['bomba_presion_bcm_01a'] ?? null;
    $bomba_presion_bcm_01b = $_POST['bomba_presion_bcm_01b'] ?? null;
    $bomba_presion_bcm_01r = $_POST['bomba_presion_bcm_01r'] ?? null;
    $nivel_tac_01_inicio = $_POST['nivel_tac_01_inicio'] ?? null;
    $nivel_tac_01_termino = $_POST['nivel_tac_01_termino'] ?? null;
    $volumen_usado = $_POST['volumen_usado'] ?? null;
    $observaciones = $_POST['observaciones'] ?? null;
    $id_responsable = $_POST['id_responsable'] ?? null;

    // Preparar la consulta SQL
    $sql = "INSERT INTO registro_operacion (fecha, hora_inicio, hora_termino, id_zona, bomba_presion_bcm_01a, bomba_presion_bcm_01b, bomba_presion_bcm_01r, nivel_tac_01_inicio, nivel_tac_01_termino, volumen_usado, observaciones, id_responsable) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);

    if ($stmt) {
        // La cadena de tipos debe ser corregida si id_zona y id_responsable son enteros.
        // Asumiendo que id_zona y id_responsable son enteros (i):
        // sss i dddddds i (12 parámetros: 3 strings, 1 int, 6 doubles, 1 string, 1 int)
        // Ya que PHP puede convertir, usaremos la tupla de tipos más segura:
        // sss i d d d d d d s i (si todos los numéricos son tratados como double/float 'd')
        // Si no, puedes usar 'd' para floats y 'i' para int. Asumiremos 'd' para las bombas/niveles/volumen y 'i' para IDs.
        
        // La secuencia de tipos correcta es: s s s i d d d d d d s i
        $stmt->bind_param("sssiddddddsi", 
            $fecha, $hora_inicio, $hora_termino, $id_zona, 
            $bomba_presion_bcm_01a, $bomba_presion_bcm_01b, $bomba_presion_bcm_01r, 
            $nivel_tac_01_inicio, $nivel_tac_01_termino, $volumen_usado, 
            $observaciones, $id_responsable);
        
        if ($stmt->execute()) {
            $response['success'] = true;
            $response['mensaje'] = "Datos registrados con éxito.";
        } else {
            $response['mensaje'] = "Error al registrar los datos: " . $stmt->error;
        }
        $stmt->close();
    } else {
        $response['mensaje'] = "Error al preparar la consulta: " . $conn->error;
    }

// ==============================================================================
// 2. ACCIÓN: OBTENER REGISTRO PARA MODIFICAR (Nuevo)
// ==============================================================================
} else if ($accion === 'obtener_registro') {
    if ($id) {
        $sql = "SELECT * FROM registro_operacion WHERE id = ?";
        $stmt = $conn->prepare($sql);

        if ($stmt) {
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                $response['success'] = true;
                $response['registro'] = $result->fetch_assoc();
            } else {
                $response['mensaje'] = "Registro no encontrado.";
            }
            $stmt->close();
        } else {
            $response['mensaje'] = "Error al preparar la consulta: " . $conn->error;
        }
    } else {
        $response['mensaje'] = "ID no proporcionado para obtener el registro.";
    }

// ==============================================================================
// 3. ACCIÓN: MODIFICAR (Nuevo)
// ==============================================================================
} else if ($accion === 'modificar') {
    if ($id) {
        // Recoger todos los datos del formulario de modificación
        $fecha = $_POST['fecha'] ?? null;
        $hora_inicio = $_POST['hora_inicio'] ?? null;
        $hora_termino = $_POST['hora_termino'] ?? null;
        $id_zona = $_POST['id_zona'] ?? null;
        $bomba_presion_bcm_01a = $_POST['bomba_presion_bcm_01a'] ?? null;
        $bomba_presion_bcm_01b = $_POST['bomba_presion_bcm_01b'] ?? null;
        $bomba_presion_bcm_01r = $_POST['bomba_presion_bcm_01r'] ?? null;
        $nivel_tac_01_inicio = $_POST['nivel_tac_01_inicio'] ?? null;
        $nivel_tac_01_termino = $_POST['nivel_tac_01_termino'] ?? null;
        $volumen_usado = $_POST['volumen_usado'] ?? null;
        $observaciones = $_POST['observaciones'] ?? null;
        $id_responsable = $_POST['id_responsable'] ?? null;

        $sql = "UPDATE registro_operacion SET 
            fecha = ?, 
            hora_inicio = ?, 
            hora_termino = ?, 
            id_zona = ?, 
            bomba_presion_bcm_01a = ?, 
            bomba_presion_bcm_01b = ?, 
            bomba_presion_bcm_01r = ?, 
            nivel_tac_01_inicio = ?, 
            nivel_tac_01_termino = ?, 
            volumen_usado = ?, 
            observaciones = ?, 
            id_responsable = ? 
            WHERE id = ?";
        
        $stmt = $conn->prepare($sql);

        if ($stmt) {
            // La secuencia de tipos es: s s s i d d d d d d s i i (13 parámetros, el último es el ID)
            $stmt->bind_param("sssiddddddsii", 
                $fecha, $hora_inicio, $hora_termino, $id_zona, 
                $bomba_presion_bcm_01a, $bomba_presion_bcm_01b, $bomba_presion_bcm_01r, 
                $nivel_tac_01_inicio, $nivel_tac_01_termino, $volumen_usado, 
                $observaciones, $id_responsable, $id);
            
            if ($stmt->execute()) {
                $response['success'] = true;
                $response['mensaje'] = "Registro con ID $id modificado con éxito.";
            } else {
                $response['mensaje'] = "Error al modificar los datos: " . $stmt->error;
            }
            $stmt->close();
        } else {
            $response['mensaje'] = "Error al preparar la consulta: " . $conn->error;
        }

    } else {
        $response['mensaje'] = "ID para modificar no proporcionado.";
    }

// ==============================================================================
// 4. ACCIÓN: ELIMINAR (Modificado para usar $_POST['id'])
// ==============================================================================
} else if ($accion === 'eliminar') {
    // CAMBIO: Ahora usamos $_POST['id'] en lugar de $_POST['id-eliminar']
    $id_eliminar = $id;

    if ($id_eliminar) {
        $sql = "DELETE FROM registro_operacion WHERE id = ?";
        $stmt = $conn->prepare($sql);

        if ($stmt) {
            $stmt->bind_param("i", $id_eliminar);
            if ($stmt->execute()) {
                if ($stmt->affected_rows > 0) {
                    $response['success'] = true;
                    $response['mensaje'] = "Dato con ID $id_eliminar eliminado con éxito.";
                } else {
                    $response['mensaje'] = "No se encontró ningún registro con el ID $id_eliminar.";
                }
            } else {
                $response['mensaje'] = "Error al eliminar el dato: " . $stmt->error;
            }
            $stmt->close();
        } else {
            $response['mensaje'] = "Error al preparar la consulta: " . $conn->error;
        }
    } else {
        $response['mensaje'] = "ID para eliminar no proporcionado.";
    }
} else {
    $response['mensaje'] = "Acción no válida.";
}

$conn->close();
echo json_encode($response);
?>