document.addEventListener('DOMContentLoaded', function() {
    // --- 1. Selectores y Variables de la Aplicación ---
    
    // Selectores para la navegación
    const navLinks = document.querySelectorAll('.sub-nav-link');
    const sections = document.querySelectorAll('.content-section');

    // Selectores para la sección de Visualizar Datos
    const mesSelect = document.getElementById('mes');
    const anioSelect = document.getElementById('anio');
    const buscarButton = document.getElementById('buscar-datos');
    const tablaDatos = document.getElementById('tabla-datos');
    const tablaDatosBody = tablaDatos.getElementsByTagName('tbody')[0];
    const tablaDatosHeadRow = tablaDatos.getElementsByTagName('thead')[0].getElementsByTagName('tr')[0];
    const paginacionDiv = document.querySelector('.paginacion');
    const mensajeStatusVisualizar = document.getElementById('mensaje-status-visualizar');

    // Selectores para la sección de Registrar Datos
    const formRegistro = document.getElementById('form-registro');
    const mensajeStatus = document.getElementById('mensaje-status');
    const idResponsableSelect = document.getElementById('id_responsable');
    const idZonaSelect = document.getElementById('id_zona');
    
    // Selectores del Modal de Modificación
    const modalModificar = document.getElementById('modal-modificar');
    const modalCloseButton = document.querySelector('#modal-modificar .close-button');
    const formModificar = document.getElementById('form-modificar');
    const modalFieldsContainer = document.getElementById('modal-fields-container');
    const modalMensajeStatus = document.getElementById('modal-mensaje-status');
    const modalId = document.getElementById('modal_id');

    // Variables de estado
    let currentPage = 1;
    const recordsPerPage = 10;
    let totalRecords = 0;
    const tabla = 'registro_operacion'; 
    
    // Columnas a mostrar en la tabla principal
    const DISPLAY_HEADERS = [
        { key: 'id', name: 'ID' },
        { key: 'fecha', name: 'Fecha' },
        { key: 'hora_inicio', name: 'Inicio' },
        { key: 'hora_termino', name: 'Término' },
        { key: 'zona_nombre', name: 'Zona' },
        { key: 'bomba_presion_bcm_01a', name: 'Bomba A' },
        { key: 'bomba_presion_bcm_01b', name: 'Bomba B' },
        { key: 'volumen_usado', name: 'Vol. Usado (m³)' },
        { key: 'responsable_nombre', name: 'Responsable' }
    ];

    // --- 2. Funciones de Utilidad ---

    /** Muestra un mensaje de estado general. */
    function mostrarMensaje(mensaje, isSuccess) {
        mensajeStatus.textContent = mensaje;
        mensajeStatus.className = '';
        mensajeStatus.classList.add('message-box');
        if (isSuccess) {
            mensajeStatus.classList.add('success');
        } else {
            mensajeStatus.classList.add('error');
        }
        setTimeout(() => {
            mensajeStatus.textContent = '';
            mensajeStatus.className = '';
        }, 5000);
    }
    
    /** Muestra un mensaje de estado en el modal. */
    function mostrarModalMensaje(mensaje, isSuccess) {
        modalMensajeStatus.textContent = mensaje;
        modalMensajeStatus.className = 'message-box';
        modalMensajeStatus.classList.add(isSuccess ? 'success' : 'error');
        modalMensajeStatus.style.display = 'block';
        setTimeout(() => {
            modalMensajeStatus.style.display = 'none';
        }, 5000);
    }
    
    /** Muestra un mensaje de estado en la sección de visualizar. */
    function mostrarMensajeVisualizar(mensaje, isSuccess) {
        mensajeStatusVisualizar.textContent = mensaje;
        mensajeStatusVisualizar.className = 'message-box';
        mensajeStatusVisualizar.classList.add(isSuccess ? 'success' : 'error');
        mensajeStatusVisualizar.style.display = 'block';
        setTimeout(() => {
            mensajeStatusVisualizar.style.display = 'none';
        }, 5000);
    }

    // --- 3. Lógica de Navegación y Carga de Selectores ---

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            sections.forEach(section => section.classList.remove('active'));
            navLinks.forEach(link => link.classList.remove('active'));
            
            const targetId = link.getAttribute('href').substring(1);
            document.getElementById(targetId).classList.add('active');
            link.classList.add('active');
            
            if (targetId === 'visualizar-datos') {
                fetchDatos();
            } else if (targetId === 'registrar-datos') {
                cargarSelectoresRegistro();
            }
        });
    });

    function cargarSelectoresRegistro() {
        // Cargar responsables
        fetch('./php/obtener_responsables.php')
            .then(response => response.json())
            .then(data => {
                idResponsableSelect.innerHTML = '<option value="">Selecciona un responsable</option>';
                data.forEach(responsable => {
                    const option = document.createElement('option');
                    option.value = responsable.id_usuario;
                    option.textContent = responsable.nombre_usuario;
                    idResponsableSelect.appendChild(option);
                });
            });

        // Cargar zonas
        fetch('./php/obtener_zonas.php')
            .then(response => response.json())
            .then(data => {
                idZonaSelect.innerHTML = '<option value="">Selecciona una zona</option>';
                data.forEach(zona => {
                    const option = document.createElement('option');
                    option.value = zona.id_zona;
                    option.textContent = zona.nombre_zona;
                    idZonaSelect.appendChild(option);
                });
            });
    }

    // Inicializa el selector de años
    const currentYear = new Date().getFullYear();
    const anioSelectElement = document.getElementById('anio');
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
        if (!anioSelectElement.querySelector(`option[value="${i}"]`)) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            anioSelectElement.appendChild(option);
        }
    }
    
    // --- 4. Lógica de Visualización y Paginación ---

    buscarButton.addEventListener('click', function() {
        currentPage = 1;
        fetchDatos();
    });

    function fetchDatos() {
        tablaDatosBody.innerHTML = `<tr><td colspan="${DISPLAY_HEADERS.length + 1}">Cargando datos...</td></tr>`;
        const mes = mesSelect.value;
        const anio = anioSelect.value;

        const formData = new FormData();
        formData.append('tabla', tabla);
        formData.append('mes', mes);
        formData.append('anio', anio);
        formData.append('pagina', currentPage);
        formData.append('limit', recordsPerPage);

        fetch('./php/obtener_datos.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Error al obtener los datos:', data.error);
                tablaDatosBody.innerHTML = `<tr><td colspan="${DISPLAY_HEADERS.length + 1}">Error al cargar los datos: ${data.error}</td></tr>`;
                paginacionDiv.innerHTML = '';
                return;
            }

            totalRecords = data.totalRecords || 0;
            mostrarDatos(data.datos);
            generarPaginacion();
        })
        .catch(error => {
            console.error('Error de red o de JSON:', error);
            tablaDatosBody.innerHTML = `<tr><td colspan="${DISPLAY_HEADERS.length + 1}">Error al cargar los datos.</td></tr>`;
            paginacionDiv.innerHTML = '';
        });
    }

    function mostrarDatos(datos) {
        tablaDatosBody.innerHTML = '';
        tablaDatosHeadRow.innerHTML = '';

        // 1. Generar Encabezados de Tabla
        DISPLAY_HEADERS.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header.name;
            tablaDatosHeadRow.appendChild(th);
        });
        
        // Añadir cabecera de Acciones
        const thAcciones = document.createElement('th');
        thAcciones.textContent = 'Acciones';
        tablaDatosHeadRow.appendChild(thAcciones);


        if (datos && datos.length > 0) {
            // 2. Generar Filas de Datos
            datos.forEach(rowData => {
                const tr = document.createElement('tr');
                
                // Celdas de datos
                DISPLAY_HEADERS.forEach(header => {
                    const td = document.createElement('td');
                    let value = rowData[header.key] ?? '';
                    td.textContent = value;
                    tr.appendChild(td);
                });
                
                // Celda de Acciones
                const tdAcciones = document.createElement('td');
                tdAcciones.innerHTML = `
                    <button class="btn btn-modificar" 
                            data-id="${rowData.id}" 
                            data-tabla="${tabla}">Modificar</button>
                    <button class="btn btn-eliminar" 
                            data-id="${rowData.id}"
                            data-tabla="${tabla}">Eliminar</button>
                `;
                tr.appendChild(tdAcciones);
                tablaDatosBody.appendChild(tr);
            });
            
            // 3. Adjuntar event listeners a los botones generados
            document.querySelectorAll('.btn-modificar').forEach(btn => {
                btn.addEventListener('click', openModificarModal);
            });
            document.querySelectorAll('.btn-eliminar').forEach(btn => {
                btn.addEventListener('click', confirmDelete);
            });

        } else {
            const colspan = tablaDatosHeadRow.children.length;
            tablaDatosBody.innerHTML = `<tr><td colspan="${colspan}">No se encontraron datos con los filtros seleccionados.</td></tr>`;
        }
    }

    /** Genera y adjunta los botones de paginación al div. */
    function generarPaginacion() {
        paginacionDiv.innerHTML = '';
        const totalPages = Math.ceil(totalRecords / recordsPerPage);

        if (totalPages > 1) {
            const ul = document.createElement('ul');
            ul.classList.add('pagination'); 

            // Botón Anterior
            ul.appendChild(createPaginationButton('Anterior', currentPage - 1, currentPage === 1));

            // Botones de las páginas (muestra un rango)
            const maxPagesToShow = 5;
            let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
            let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

            if (endPage - startPage + 1 < maxPagesToShow) {
                startPage = Math.max(1, endPage - maxPagesToShow + 1);
            }

            for (let i = startPage; i <= endPage; i++) {
                ul.appendChild(createPaginationButton(i, i, i === currentPage));
            }

            // Botón Siguiente
            ul.appendChild(createPaginationButton('Siguiente', currentPage + 1, currentPage === totalPages));

            paginacionDiv.appendChild(ul);
        }
    }
    
    /** Crea un botón de paginación con su listener. */
    function createPaginationButton(text, pageNum, isDisabled) {
        const li = document.createElement('li');
        li.classList.add('page-item');
        if (isDisabled) li.classList.add('disabled');
        if (pageNum === currentPage && !isNaN(pageNum)) li.classList.add('active');

        const a = document.createElement('a');
        a.classList.add('page-link');
        a.href = '#';
        a.textContent = text;
        a.dataset.page = pageNum;
        
        a.addEventListener('click', function(e) {
            e.preventDefault();
            if (!isDisabled) {
                currentPage = pageNum;
                fetchDatos();
            }
        });
        
        li.appendChild(a);
        return li;
    }


    // --- 5. Lógica de Registro ---
    
    formRegistro.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(formRegistro);
        formData.append('accion', 'registrar');
        formData.append('tabla', tabla);
        
        // Validación crítica
        if (!formData.get('id_responsable') || formData.get('id_responsable') === "") {
            mostrarMensaje("Por favor, selecciona un Responsable válido.", false);
            return;
        }
        if (!formData.get('id_zona') || formData.get('id_zona') === "") {
            mostrarMensaje("Por favor, selecciona una Zona de Riego válida.", false);
            return;
        }

        fetch('./php/procesar_riego.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            mostrarMensaje(data.mensaje, data.success);
            if (data.success) {
                formRegistro.reset();
                fetchDatos(); // Recargar datos
            }
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarMensaje('Error de conexión con el servidor.', false);
        });
    });


    // --- 6. Lógica de Modificación y Eliminación (CRUD) ---

    function openModificarModal(e) {
        const id = e.currentTarget.dataset.id;
        
        modalFieldsContainer.innerHTML = 'Cargando datos...';
        modalMensajeStatus.style.display = 'none';

        const formData = new FormData();
        formData.append('accion', 'obtener_registro');
        formData.append('id', id);
        formData.append('tabla', tabla);

        fetch('./php/procesar_riego.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const registro = data.registro;
                modalId.value = id;
                
                modalFieldsContainer.innerHTML = generarCamposModificar(registro);
                
                // Cargar selectores dentro del modal
                cargarSelectoresModal(registro.id_responsable, registro.id_zona);
                
                modalModificar.style.display = "block";
                
            } else {
                mostrarMensajeVisualizar(data.mensaje || 'Error al obtener el registro.', false);
                modalFieldsContainer.innerHTML = `<p style="color:red;">Error: ${data.mensaje || 'No se pudo cargar la información.'}</p>`;
            }
        })
        .catch(error => {
            console.error('Error al obtener registro para modificar:', error);
            mostrarMensajeVisualizar('Error de red al cargar el registro para modificar.', false);
        });
    }
    
    function cargarSelectoresModal(idResponsableActual, idZonaActual) {
        // Cargar Responsables
        fetch('./php/obtener_responsables.php')
            .then(response => response.json())
            .then(data => {
                const selectModal = document.getElementById('modal_id_responsable');
                if (selectModal) {
                    selectModal.innerHTML = '<option value="">Selecciona un Responsable</option>';
                    data.forEach(resp => {
                        const option = document.createElement('option');
                        option.value = resp.id_usuario;
                        option.textContent = resp.nombre_usuario;
                        if (String(resp.id_usuario) === String(idResponsableActual)) {
                            option.selected = true;
                        }
                        selectModal.appendChild(option);
                    });
                }
            });

        // Cargar Zonas
        fetch('./php/obtener_zonas.php')
            .then(response => response.json())
            .then(data => {
                const selectModal = document.getElementById('modal_id_zona');
                if (selectModal) {
                    selectModal.innerHTML = '<option value="">Selecciona una Zona</option>';
                    data.forEach(zona => {
                        const option = document.createElement('option');
                        option.value = zona.id_zona;
                        option.textContent = zona.nombre_zona;
                        if (String(zona.id_zona) === String(idZonaActual)) {
                            option.selected = true;
                        }
                        selectModal.appendChild(option);
                    });
                }
            });
    }

    function generarCamposModificar(registro) {
        // Mapeo de columnas con nombres amigables
        const campos = [
            { key: 'fecha', label: 'Fecha', type: 'date', required: true },
            { key: 'hora_inicio', label: 'Hora de Inicio', type: 'time', step: 1, required: true },
            { key: 'hora_termino', label: 'Hora de Término', type: 'time', step: 1, required: true },
            { key: 'id_zona', label: 'Zona de Riego', type: 'select', select_id: 'modal_id_zona', required: true },
            { key: 'bomba_presion_bcm_01a', label: 'Bomba 01A (PSI)', type: 'number', step: 0.01 },
            { key: 'bomba_presion_bcm_01b', label: 'Bomba 01B (PSI)', type: 'number', step: 0.01 },
            { key: 'bomba_presion_bcm_01r', label: 'Bomba 01R (PSI)', type: 'number', step: 0.01 },
            { key: 'nivel_tac_01_inicio', label: 'Nivel TAC 01 (Inicio)', type: 'number', step: 0.01 },
            { key: 'nivel_tac_01_termino', label: 'Nivel TAC 01 (Término)', type: 'number', step: 0.01 },
            { key: 'volumen_usado', label: 'Volumen Usado (m³)', type: 'number', step: 0.01 },
            { key: 'observaciones', label: 'Observaciones', type: 'textarea' },
            { key: 'id_responsable', label: 'Responsable', type: 'select', select_id: 'modal_id_responsable', required: true },
        ];

        let html = '';
        campos.forEach(campo => {
            const value = registro[campo.key] ?? '';
            const requiredAttr = campo.required ? 'required' : '';
            const stepAttr = campo.step ? `step="${campo.step}"` : '';

            html += `<div class="input-group">`;
            html += `<label for="modal_${campo.key}">${campo.label}:</label>`;
            
            if (campo.type === 'select') {
                html += `<select id="${campo.select_id}" name="${campo.key}" ${requiredAttr}></select>`;
            } else if (campo.type === 'textarea') {
                html += `<textarea id="modal_${campo.key}" name="${campo.key}" ${requiredAttr}>${value}</textarea>`;
            } else {
                html += `<input type="${campo.type}" id="modal_${campo.key}" name="${campo.key}" value="${value}" ${stepAttr} ${requiredAttr}>`;
            }

            html += `</div>`;
        });
        return html;
    }
    
    modalCloseButton.onclick = function() {
        modalModificar.style.display = "none";
        modalFieldsContainer.innerHTML = '';
    }

    formModificar.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(formModificar);
        formData.append('accion', 'modificar');

        fetch('./php/procesar_riego.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                mostrarModalMensaje(data.mensaje, true);
                fetchDatos(); // Recargar tabla principal
                setTimeout(() => { modalModificar.style.display = "none"; }, 1500);
            } else {
                mostrarModalMensaje(data.mensaje, false);
            }
        })
        .catch(error => {
            console.error('Error en fetch modificar:', error);
            mostrarModalMensaje('Error de red al intentar modificar.', false);
        });
    });

    function confirmDelete(e) {
        const id = e.currentTarget.dataset.id;

        if (confirm(`¿Estás seguro de eliminar el registro de Riego con ID ${id}?`)) {
            const formData = new FormData();
            formData.append('accion', 'eliminar');
            formData.append('id', id);
            formData.append('tabla', tabla);

            fetch('./php/procesar_riego.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    mostrarMensajeVisualizar(data.mensaje, true);
                    fetchDatos(); // Recargar tabla
                } else {
                    mostrarMensajeVisualizar(data.mensaje, false);
                }
            })
            .catch(error => {
                console.error('Error en fetch eliminar:', error);
                mostrarMensajeVisualizar('Error de red al intentar eliminar el registro.', false);
            });
        }
    }


    // --- 7. Inicialización ---
    // Activa la sección de Visualización al cargar
    const visualizarLink = document.querySelector('a[href="#visualizar-datos"]');
    if (visualizarLink) {
        visualizarLink.classList.add('active');
    }
    const visualizarSection = document.getElementById('visualizar-datos');
    if (visualizarSection) {
        visualizarSection.classList.add('active');
    }
    
    // Carga inicial de datos (página 1)
    fetchDatos(); 
});