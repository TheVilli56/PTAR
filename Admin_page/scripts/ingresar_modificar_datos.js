document.addEventListener('DOMContentLoaded', function() {
    const tablaSelect = document.getElementById('tabla');
    const mesSelect = document.getElementById('mes');
    const anioSelect = document.getElementById('anio');
    const buscarButton = document.getElementById('buscar-datos');
    const tablaContenedor = document.getElementById('tabla-contenedor');
    const tablaDatosBody = document.getElementById('tabla-datos').getElementsByTagName('tbody')[0];
    const tablaDatosHeadRow = document.getElementById('tabla-datos').getElementsByTagName('thead')[0].getElementsByTagName('tr')[0];
    const paginacionDiv = document.querySelector('.paginacion');

    const insertarRegistroButton = document.getElementById('insertar-registro');
    const cargarArchivoButton = document.getElementById('cargar-archivo-btn');
    const fileUploadInput = document.getElementById('file-upload');

    const formularioInsertarDiv = document.getElementById('formulario-insertar');
    const formularioDatosInsertar = document.getElementById('formulario-datos-insertar');
    const guardarNuevoButton = document.getElementById('guardar-nuevo');
    const cancelarInsertarButton = document.getElementById('cancelar-insertar');

    const formularioModificarDiv = document.getElementById('formulario-modificar');
    const formularioDatosModificar = document.getElementById('formulario-datos-modificar');
    const guardarCambiosButton = document.getElementById('guardar-cambios');
    const borrarRegistroButton = document.getElementById('borrar-registro');
    const cancelarModificarButton = document.getElementById('cancelar-modificar');


    let currentPage = 1;
    const recordsPerPage = 20;
    let totalRecords = 0;
    let currentTable = tablaSelect.value; // Inicializa con el valor predeterminado
    let recordToModifyId = null; // Para almacenar el ID del registro que se está modificando/borrando
    let currentTablePrimaryColumn = ''; // Para almacenar el nombre de la columna primary key

    // Función para obtener las cabeceras de la tabla (y la clave primaria)
    // Se usa obtener_columnas.php para esto
    function fetchTableColumns(tableName) {
        const formData = new FormData();
        formData.append('tabla', tableName);

        return fetch('php/obtener_columnas.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Error al obtener columnas:', data.error);
                return null;
            }
            // Encuentra la columna que es PRIMARY KEY
            const primaryKeyCol = data.columns.find(col => col.Key === 'PRI');
            if (primaryKeyCol) {
                currentTablePrimaryColumn = primaryKeyCol.Field;
            } else {
                console.warn(`No se encontró una clave primaria para la tabla ${tableName}. Esto podría causar problemas al modificar/borrar.`);
                currentTablePrimaryColumn = 'id'; // Fallback a un ID genérico
            }
            return data.columns;
        })
        .catch(error => {
            console.error('Error de red al obtener columnas:', error);
            return null;
        });
    }

    // Inicializar al cargar la página
    tablaSelect.addEventListener('change', function() {
        currentTable = tablaSelect.value; // Actualiza la tabla actual
        currentPage = 1; // Reiniciar paginación
        fetchAndDisplayData();
    });

    buscarButton.addEventListener('click', function() {
        currentPage = 1;
        fetchAndDisplayData();
    });

    // Cargar datos y columnas al inicio
    fetchTableColumns(currentTable).then(() => {
        fetchAndDisplayData();
    });

    function fetchAndDisplayData() {
        const tabla = currentTable;
        const mes = mesSelect.value;
        const anio = anioSelect.value;

        // Ocultar formularios y mostrar tabla
        tablaContenedor.style.display = 'block';
        formularioModificarDiv.style.display = 'none';
        formularioInsertarDiv.style.display = 'none';
        insertarRegistroButton.style.display = 'inline-block'; // Asegúrate de que el botón de insertar esté visible
        cargarArchivoButton.style.display = 'inline-block'; // Asegúrate de que el botón de cargar archivo esté visible


        const formData = new FormData();
        formData.append('tabla', tabla);
        formData.append('mes', mes);
        formData.append('anio', anio);
        formData.append('pagina', currentPage);
        formData.append('limit', recordsPerPage);

        fetch('php/obtener_datos.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Error al obtener los datos:', data.error);
                tablaDatosBody.innerHTML = `<tr><td colspan="100%">Error al cargar los datos: ${data.error}</td></tr>`;
                paginacionDiv.innerHTML = '';
                return;
            }

            totalRecords = data.totalRecords;
            mostrarDatosConAcciones(data.datos);
            generarPaginacion();
        })
        .catch(error => {
            console.error('Error de red:', error);
            tablaDatosBody.innerHTML = `<tr><td colspan="100%">Error de red al cargar los datos.</td></tr>`;
            paginacionDiv.innerHTML = '';
        });
    }

    function mostrarDatosConAcciones(datos) {
        tablaDatosBody.innerHTML = '';
        tablaDatosHeadRow.innerHTML = '';

        if (datos && datos.length > 0) {
            // Obtener todas las claves del primer objeto de datos (incluye los campos de los JOINs)
            const allHeaders = Object.keys(datos[0]);
            
            // Reordenar las cabeceras y filtrar los IDs si los nombres están presentes
            const displayOrder = [];
            // Aquí no tenemos `currentTableHeaders` del obtener_columnas.php, así que iteramos sobre `allHeaders`
            // y eliminamos los IDs si sus nombres amigables están presentes
            allHeaders.forEach(header => {
                if (header === 'id_responsable' && allHeaders.includes('responsable_nombre')) {
                    // No añadir id_responsable si responsable_nombre ya está
                } else if (header === 'id_zona' && allHeaders.includes('zona_nombre')) {
                    // No añadir id_zona si zona_nombre ya está
                } else {
                    displayOrder.push(header);
                }
            });

            // Asegurarse de que 'responsable_nombre' y 'zona_nombre' estén al final si existen
            ['responsable_nombre', 'zona_nombre'].forEach(nameCol => {
                if (allHeaders.includes(nameCol) && !displayOrder.includes(nameCol)) {
                    displayOrder.push(nameCol);
                }
            });

            displayOrder.forEach(headerText => {
                const th = document.createElement('th');
                let friendlyName = headerText;
                if (headerText === 'responsable_nombre') {
                    friendlyName = 'Responsable';
                } else if (headerText === 'zona_nombre') {
                    friendlyName = 'Zona';
                } else {
                    friendlyName = headerText.replace(/_/g, ' ');
                }
                th.textContent = friendlyName;
                tablaDatosHeadRow.appendChild(th);
            });
            const thAcciones = document.createElement('th');
            thAcciones.textContent = 'Acciones';
            tablaDatosHeadRow.appendChild(thAcciones);

            datos.forEach(rowData => {
                const tr = document.createElement('tr');
                const recordId = rowData[currentTablePrimaryColumn]; // Usa la clave primaria detectada

                displayOrder.forEach(key => {
                    const td = document.createElement('td');
                    td.textContent = rowData[key];
                    tr.appendChild(td);
                });

                const tdAcciones = document.createElement('td');
                const modificarButton = document.createElement('button');
                modificarButton.textContent = 'Modificar';
                modificarButton.classList.add('modificar-btn');
                modificarButton.addEventListener('click', function() {
                    mostrarFormularioModificar(rowData);
                });
                tdAcciones.appendChild(modificarButton);

                const borrarButton = document.createElement('button');
                borrarButton.textContent = 'Borrar';
                borrarButton.classList.add('borrar-btn');
                borrarButton.addEventListener('click', function() {
                    if (confirm('¿Estás seguro de que deseas borrar este registro?')) {
                        borrarRegistro(recordId);
                    }
                });
                tdAcciones.appendChild(borrarButton);
                tr.appendChild(tdAcciones);
                tablaDatosBody.appendChild(tr);
            });
        } else {
            const colspan = tablaDatosHeadRow.children.length > 0 ? tablaDatosHeadRow.children.length : 5;
            tablaDatosBody.innerHTML = `<tr><td colspan="${colspan}">No se encontraron datos con los filtros seleccionados.</td></tr>`;
        }
    }

    function generarPaginacion() {
        paginacionDiv.innerHTML = '';
        const totalPages = Math.ceil(totalRecords / recordsPerPage);

        if (totalPages > 1) {
            const prevButton = document.createElement('button');
            prevButton.textContent = 'Anterior';
            prevButton.disabled = currentPage === 1;
            prevButton.addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    fetchAndDisplayData();
                }
            });
            paginacionDiv.appendChild(prevButton);

            let startPage = Math.max(1, currentPage - 2);
            let endPage = Math.min(totalPages, currentPage + 2);

            if (endPage - startPage + 1 < 5) {
                if (currentPage < totalPages - 1) {
                    endPage = Math.min(totalPages, startPage + 4);
                } else {
                    startPage = Math.max(1, endPage - 4);
                }
            }
            
            for (let i = startPage; i <= endPage; i++) {
                const button = document.createElement('button');
                button.textContent = i;
                if (i === currentPage) {
                    button.classList.add('active');
                }
                button.addEventListener('click', function() {
                    currentPage = parseInt(this.textContent);
                    fetchAndDisplayData();
                });
                paginacionDiv.appendChild(button);
            }

            const nextButton = document.createElement('button');
            nextButton.textContent = 'Siguiente';
            nextButton.disabled = currentPage === totalPages;
            nextButton.addEventListener('click', () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    fetchAndDisplayData();
                }
            });
            paginacionDiv.appendChild(nextButton);
        }
    }

    // --- Funcionalidad de Modificar Registro ---
    function mostrarFormularioModificar(rowData) {
        recordToModifyId = rowData[currentTablePrimaryColumn]; // Usa la clave primaria detectada
        
        // Ocultar tabla y mostrar formulario
        tablaContenedor.style.display = 'none';
        formularioInsertarDiv.style.display = 'none'; // Asegúrate de ocultar el formulario de insertar
        insertarRegistroButton.style.display = 'none'; // Ocultar botón de insertar
        cargarArchivoButton.style.display = 'none'; // Ocultar botón de cargar archivo
        formularioModificarDiv.style.display = 'block';

        formularioDatosModificar.innerHTML = ''; // Limpiar formulario anterior

        // Obtener las columnas de la tabla para generar los inputs dinámicamente
        fetchTableColumns(currentTable).then(columns => {
            if (!columns) return;

            columns.forEach(col => {
                const fieldName = col.Field;
                const fieldType = col.Type;
                const isPrimaryKey = col.Key === 'PRI';
                
                // Excluir la clave primaria del formulario si es autoincrementable
                if (isPrimaryKey && col.Extra === 'auto_increment') {
                    // No mostrar el campo ID en el formulario de modificación si es auto_increment
                    // Pero guardamos su valor para la actualización
                    return; 
                }
                
                const label = document.createElement('label');
                label.textContent = fieldName.replace(/_/g, ' '); // Nombre amigable para el label

                let input;
                if (fieldName === 'responsable_nombre' || fieldName === 'zona_nombre') {
                    // Estas son columnas de JOIN, no se deben modificar directamente
                    // Se muestran solo como información
                    input = document.createElement('input');
                    input.type = 'text';
                    input.value = rowData[fieldName] || '';
                    input.disabled = true; // No editable
                } else if (fieldType.includes('date')) {
                    input = document.createElement('input');
                    input.type = 'date';
                    input.value = rowData[fieldName] ? rowData[fieldName].split(' ')[0] : ''; // Formato YYYY-MM-DD
                } else if (fieldType.includes('time')) {
                    input = document.createElement('input');
                    input.type = 'time';
                    input.value = rowData[fieldName] || '';
                } else if (fieldType.includes('datetime') || fieldType.includes('timestamp')) {
                    input = document.createElement('input');
                    input.type = 'datetime-local';
                    // Formato para datetime-local: YYYY-MM-DDTHH:mm
                    input.value = rowData[fieldName] ? rowData[fieldName].replace(' ', 'T').substring(0, 16) : '';
                }
                else if (fieldType.includes('int') || fieldType.includes('decimal') || fieldType.includes('float') || fieldType.includes('double')) {
                    input = document.createElement('input');
                    input.type = 'number';
                    input.step = 'any'; // Para números decimales
                    input.value = rowData[fieldName] || '';
                }
                else if (fieldName === 'id_responsable') {
                    // Si es id_responsable, crear un select si tienes una lista de usuarios
                    // Para este ejemplo, haremos un input de texto, pero lo ideal sería un <select>
                    input = document.createElement('input');
                    input.type = 'number'; // Asumiendo que es un ID numérico
                    input.name = fieldName;
                    input.value = rowData[fieldName] || '';
                    // Si tienes una tabla de usuarios, aquí llamarías a un fetch para llenar un <select>
                    // fetch('php/obtener_usuarios.php').then(...).then(users => { ... })
                } else if (fieldName === 'id_zona') {
                    // Si es id_zona, crear un select si tienes una lista de zonas
                    input = document.createElement('input');
                    input.type = 'number'; // Asumiendo que es un ID numérico
                    input.name = fieldName;
                    input.value = rowData[fieldName] || '';
                    // fetch('php/obtener_zonas.php').then(...).then(zones => { ... })
                }
                else {
                    input = document.createElement('input');
                    input.type = 'text';
                    input.value = rowData[fieldName] || '';
                }

                input.name = fieldName; // Importante para FormData
                formularioDatosModificar.appendChild(label);
                formularioDatosModificar.appendChild(input);
            });
        });
    }

    guardarCambiosButton.addEventListener('click', function() {
        if (!recordToModifyId) {
            alert('No se ha seleccionado ningún registro para modificar.');
            return;
        }
        
        const formData = new FormData(formularioDatosModificar);
        formData.append('id', recordToModifyId); // Añade el ID de la clave primaria
        formData.append('tabla', currentTable);

        fetch('php/modificar_registro.php', { // Usar el nuevo script de modificar
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Cambios guardados exitosamente.');
                fetchAndDisplayData(); // Recargar la tabla
            } else {
                console.error('Error al guardar los cambios:', data.error);
                alert('Error al guardar los cambios: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error de red al guardar los cambios:', error);
            alert('Error de red al guardar los cambios.');
        });
    });

    borrarRegistroButton.addEventListener('click', function() {
        if (!recordToModifyId) {
            alert('No se ha seleccionado ningún registro para borrar.');
            return;
        }

        if (confirm('¿Estás seguro de que deseas borrar este registro de forma permanente?')) {
            const formData = new FormData();
            formData.append('id', recordToModifyId); // Añade el ID de la clave primaria
            formData.append('tabla', currentTable);

            fetch('php/borrar_registro.php', { // Usar el nuevo script de borrar
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Registro borrado exitosamente.');
                    fetchAndDisplayData(); // Recargar la tabla
                } else {
                    console.error('Error al borrar el registro:', data.error);
                    alert('Error al borrar el registro: ' + data.error);
                }
            })
            .catch(error => {
                console.error('Error de red al borrar el registro:', error);
                alert('Error de red al borrar el registro.');
            });
        }
    });

    cancelarModificarButton.addEventListener('click', function() {
        // Simplemente vuelve a mostrar la tabla y oculta el formulario
        fetchAndDisplayData();
    });


    // --- Funcionalidad de Insertar Nuevo Registro ---
    insertarRegistroButton.addEventListener('click', function() {
        // Ocultar tabla y mostrar formulario de insertar
        tablaContenedor.style.display = 'none';
        paginacionDiv.style.display = 'none'; // Ocultar paginación
        formularioModificarDiv.style.display = 'none'; // Asegúrate de ocultar el formulario de modificar
        insertarRegistroButton.style.display = 'none'; // Ocultar el botón de insertar
        cargarArchivoButton.style.display = 'none'; // Ocultar el botón de cargar archivo
        formularioInsertarDiv.style.display = 'block';

        formularioDatosInsertar.innerHTML = ''; // Limpiar formulario anterior

        // Obtener las columnas para generar los inputs dinámicamente
        fetchTableColumns(currentTable).then(columns => {
            if (!columns) return;

            columns.forEach(col => {
                const fieldName = col.Field;
                const fieldType = col.Type;
                const isPrimaryKey = col.Key === 'PRI';
                const isAutoIncrement = col.Extra.includes('auto_increment');

                // Excluir la clave primaria autoincrementable del formulario de inserción
                if (isPrimaryKey && isAutoIncrement) {
                    return; // No necesitamos que el usuario ingrese el ID
                }

                const label = document.createElement('label');
                label.textContent = fieldName.replace(/_/g, ' ');

                let input;
                if (fieldName === 'responsable_nombre' || fieldName === 'zona_nombre') {
                    // Estas son columnas de JOIN, no se deben insertar
                    return;
                } else if (fieldType.includes('date')) {
                    input = document.createElement('input');
                    input.type = 'date';
                } else if (fieldType.includes('time')) {
                    input = document.createElement('input');
                    input.type = 'time';
                } else if (fieldType.includes('datetime') || fieldType.includes('timestamp')) {
                    input = document.createElement('input');
                    input.type = 'datetime-local';
                }
                else if (fieldType.includes('int') || fieldType.includes('decimal') || fieldType.includes('float') || fieldType.includes('double')) {
                    input = document.createElement('input');
                    input.type = 'number';
                    input.step = 'any';
                }
                else if (fieldName === 'id_responsable') {
                    // Si es id_responsable, crear un select si tienes una lista de usuarios
                    input = document.createElement('input');
                    input.type = 'number'; // Asumiendo que es un ID numérico
                    input.name = fieldName;
                    // fetch('php/obtener_usuarios.php').then(...).then(users => { ... }) para el select
                } else if (fieldName === 'id_zona') {
                    // Si es id_zona, crear un select si tienes una lista de zonas
                    input = document.createElement('input');
                    input.type = 'number'; // Asumiendo que es un ID numérico
                    input.name = fieldName;
                    // fetch('php/obtener_zonas.php').then(...).then(zones => { ... }) para el select
                }
                else {
                    input = document.createElement('input');
                    input.type = 'text';
                }

                input.name = fieldName;
                input.required = col.Null === 'NO' && !isAutoIncrement; // Marcar como requerido si no permite NULL y no es auto_increment
                
                formularioDatosInsertar.appendChild(label);
                formularioDatosInsertar.appendChild(input);
            });
        });
    });

    guardarNuevoButton.addEventListener('click', function(event) {
        event.preventDefault(); // Evitar el envío de formulario HTML por defecto

        const formData = new FormData(formularioDatosInsertar);
        formData.append('tabla', currentTable);

        fetch('php/insertar_registro.php', { // Usar el nuevo script de insertar
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Registro insertado exitosamente. ID: ' + data.inserted_id);
                formularioDatosInsertar.reset(); // Limpiar el formulario
                fetchAndDisplayData(); // Recargar la tabla
            } else {
                console.error('Error al insertar el registro:', data.error);
                alert('Error al insertar el registro: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error de red al insertar el registro:', error);
            alert('Error de red al insertar el registro.');
        });
    });

    cancelarInsertarButton.addEventListener('click', function() {
        formularioDatosInsertar.reset(); // Limpiar el formulario
        fetchAndDisplayData(); // Volver a la vista de la tabla
    });


    // --- Funcionalidad de Cargar Archivo ---
    cargarArchivoButton.addEventListener('click', function() {
        fileUploadInput.click(); // Simula el click en el input de tipo file
    });

    fileUploadInput.addEventListener('change', function() {
        if (fileUploadInput.files.length > 0) {
            const file = fileUploadInput.files[0];
            const formData = new FormData();
            formData.append('tabla', currentTable);
            formData.append('archivo', file);

            // Muestra un mensaje de carga
            alert('Cargando archivo... Por favor espera.');

            fetch('php/cargar_csv_excel.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(`Archivo cargado exitosamente. Filas insertadas: ${data.inserted_rows}`);
                    fetchAndDisplayData(); // Recargar la tabla después de la carga
                } else {
                    console.error('Error al cargar el archivo:', data.error);
                    alert('Error al cargar el archivo: ' + data.error);
                }
            })
            .catch(error => {
                console.error('Error de red al cargar el archivo:', error);
                alert('Error de red al cargar el archivo.');
            })
            .finally(() => {
                fileUploadInput.value = ''; // Limpiar el input para permitir recargar el mismo archivo
            });
        }
    });

    // Inicializar el select de año (mantener esta lógica)
    const currentYear = new Date().getFullYear();
    const anioSelectElement = document.getElementById('anio');
    // Asegurarse de que el año actual y siguientes estén en el select de anio
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
        if (!anioSelectElement.querySelector(`option[value="${i}"]`)) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            anioSelectElement.appendChild(option);
        }
    }
});