document.addEventListener('DOMContentLoaded', function() {
    // --- 1. Selectores y Variables de la Aplicación ---
    const tabLinks = document.querySelectorAll('.tab-link');
    const sections = document.querySelectorAll('.content-section');
    const mesSelect = document.getElementById('mes');
    const anioSelect = document.getElementById('anio');
    const bombaSelect = document.getElementById('bomba'); 
    const buscarButton = document.getElementById('buscar-datos');
    const tablaDatosBody = document.getElementById('tabla-datos').getElementsByTagName('tbody')[0];
    const tablaDatosHeadRow = document.getElementById('tabla-datos').getElementsByTagName('thead')[0].getElementsByTagName('tr')[0];
    const paginacionDiv = document.querySelector('.paginacion');
    const tablaCaption = document.querySelector('#tabla-datos caption'); 
    const formRegistro = document.getElementById('form-registro');
    const mensajeStatus = document.getElementById('mensaje-status');
    const idResponsableSelect = document.getElementById('id_usuario');
    
    // Selectores del Modal
    const modalModificar = document.getElementById('modal-modificar');
    const modalCloseButton = document.querySelector('.close-button');
    const formModificar = document.getElementById('form-modificar');
    const modalFieldsContainer = document.getElementById('modal-fields-container');
    const modalMensajeStatus = document.getElementById('modal-mensaje-status');

    // Variables de estado
    let currentPage = 1;
    const recordsPerPage = 10; 
    let totalRecords = 0;
    let currentTableName = bombaSelect.value; 
    let currentTableHeaders = [];

    // Mapeo de columnas
    const muestreoMap = {
        'csc': { 
            name: 'Punto de Muestreo: CSC (Cárcamo Salida Colectores)', 
            columns: ['reg', 'fecha', 'hora', 'ddq', 'ph', 't'] 
        },
        'rac': { 
            name: 'Punto de Muestreo: RAC (Reactor Aerobio)', 
            columns: ['reg', 'fecha', 'hora', 'ddq', 'ph', 't'] 
        },
        'rec01': { 
            name: 'Punto de Muestreo: REC-01 (Clarificador)', 
            columns: ['reg', 'fecha', 'hora', 'ssed', 'od', 'ph', 't'] 
        },
        'tec01': { 
            name: 'Punto de Muestreo: TEC-01 (Cárcamo de Entrada)', 
            columns: ['reg', 'fecha', 'hora', 'nivel', 'ph', 'dqo', 't'] 
        }
    };

    // --- 2. Lógica de Navegación ---
    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            sections.forEach(section => section.classList.remove('active'));
            tabLinks.forEach(link => link.classList.remove('active'));
            
            const targetId = link.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
            link.classList.add('active');
            
            if (targetId === 'visualizar-datos') {
                currentTableName = bombaSelect.value; 
                fetchHeaders(); 
            } else if (targetId === 'registrar-datos') {
                cargarSelectores();
            }
        });
    });

    // --- 3. Visualización de Datos ---
    bombaSelect.addEventListener('change', function() {
        currentTableName = this.value; 
        currentPage = 1; 
        fetchHeaders(); 
    });

    buscarButton.addEventListener('click', function() {
        currentPage = 1;
        fetchDatos(); 
    });

    function fetchHeaders() {
        const muestreoConfig = muestreoMap[currentTableName];
        if (muestreoConfig) {
            currentTableHeaders = muestreoConfig.columns;
            if (tablaCaption) tablaCaption.textContent = muestreoConfig.name;
        }
        fetchDatos();
    }

    function fetchDatos() {
        const mes = mesSelect.value;
        const anio = anioSelect.value;
        const formData = new FormData();
        formData.append('tabla', currentTableName);
        formData.append('mes', mes);
        formData.append('anio', anio);
        formData.append('pagina', currentPage);
        formData.append('limit', recordsPerPage);

        fetch('./php/obtener_datos.php', { method: 'POST', body: formData })
        .then(response => response.json())
        .then(data => {
            if (data.error) throw new Error(data.error);
            totalRecords = data.totalRecords;
            mostrarDatos(data.datos);
            generarPaginacion();
        })
        .catch(error => {
            console.error('Error:', error);
            tablaDatosBody.innerHTML = `<tr><td colspan="100%">Error al cargar los datos.</td></tr>`;
        });
    }

    function mostrarDatos(datos) {
        tablaDatosBody.innerHTML = '';
        tablaDatosHeadRow.innerHTML = '';
        const headersToShow = [...currentTableHeaders]; 
        
        if (datos && datos.length > 0) {
            headersToShow.forEach(headerKey => {
                const th = document.createElement('th');
                th.textContent = getFriendlyName(headerKey).toUpperCase();
                tablaDatosHeadRow.appendChild(th);
            });
            const thAcciones = document.createElement('th');
            thAcciones.textContent = 'ACCIONES';
            tablaDatosHeadRow.appendChild(thAcciones);

            datos.forEach(rowData => {
                const tr = document.createElement('tr');
                headersToShow.forEach(key => {
                    const td = document.createElement('td');
                    td.textContent = rowData[key] !== null ? rowData[key] : '-'; 
                    tr.appendChild(td);
                });

                const tdAcciones = document.createElement('td');
                tdAcciones.className = 'action-buttons-container';

                const btnModificar = document.createElement('button');
                btnModificar.textContent = 'Modificar';
                btnModificar.className = 'action-button modify-button';
                btnModificar.onclick = () => openModificarModal(rowData.reg, currentTableName);
                
                const btnEliminar = document.createElement('button');
                btnEliminar.textContent = 'Eliminar';
                btnEliminar.className = 'action-button delete-button';
                btnEliminar.onclick = () => confirmDelete(rowData.reg, currentTableName);

                tdAcciones.appendChild(btnModificar);
                tdAcciones.appendChild(btnEliminar);
                tr.appendChild(tdAcciones);
                tablaDatosBody.appendChild(tr);
            });
        } else {
            tablaDatosBody.innerHTML = `<tr><td colspan="100%">No se encontraron datos.</td></tr>`;
        }
    }

    function getFriendlyName(key) {
        const names = {
            'reg': 'Reg.', 'ddq': 'DQO (mg/L)', 'dqo': 'DQO (mg/L)', 
            'ph': 'pH', 't': 'T (°C)', 'nivel': 'Nivel (m)', 
            'ssed': 'SSED (mL/L)', 'od': 'OD (mg/L)'
        };
        return names[key] || key.replace(/_/g, ' ');
    }

    // --- 4. Modales y Acciones ---
    function openModificarModal(regId, tabla) {
        modalFieldsContainer.innerHTML = 'Cargando datos...';
        document.getElementById('modal_reg').value = regId;
        document.getElementById('modal_tabla').value = tabla;
        
        const formData = new FormData();
        formData.append('accion', 'obtener_registro');
        formData.append('tabla', tabla);
        formData.append('reg', regId);

        fetch('./php/procesar_sst.php', { method: 'POST', body: formData })
        .then(response => response.json())
        .then(data => {
            modalFieldsContainer.innerHTML = '';
            if (data.success && data.registro) {
                const config = muestreoMap[tabla];
                config.columns.filter(col => col !== 'reg').forEach(col => {
                    const inputGroup = document.createElement('div');
                    inputGroup.className = 'input-group';
                    const label = document.createElement('label');
                    label.textContent = getFriendlyName(col) + ':';
                    const input = document.createElement('input');
                    input.type = (col === 'fecha' || col === 'hora') ? col : 'number';
                    if (input.type === 'number') input.step = "0.01";
                    input.name = col;
                    input.value = data.registro[col] || '';
                    input.required = true;
                    inputGroup.appendChild(label);
                    inputGroup.appendChild(input);
                    modalFieldsContainer.appendChild(inputGroup);
                });
                modalModificar.style.display = "block";
            }
        });
    }

    formModificar.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(formModificar);
        formData.append('accion', 'modificar');

        fetch('./php/procesar_sst.php', { method: 'POST', body: formData })
        .then(response => response.json())
        .then(data => {
            mostrarMensajeModal(data.mensaje, data.success);
            if (data.success) {
                setTimeout(() => {
                    modalModificar.style.display = "none";
                    fetchHeaders();
                }, 1500);
            }
        });
    });

    function confirmDelete(regId, tabla) {
        if (confirm(`¿Eliminar registro ${regId} de ${tabla}?`)) {
            const formData = new FormData();
            formData.append('accion', 'eliminar');
            formData.append('id_eliminar', regId);
            formData.append('tabla_eliminar', tabla);

            fetch('./php/procesar_sst.php', { method: 'POST', body: formData })
            .then(response => response.json())
            .then(data => {
                mostrarMensaje(data.mensaje, data.success);
                if (data.success) fetchHeaders();
            });
        }
    }

    // --- 5. Registro de Datos (Corregido para manejar el ID) ---
    formRegistro.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(formRegistro);
        formData.append('accion', 'registrar');

        // Eliminamos explícitamente cualquier valor de 'reg' si existiera en el form
        // para que el PHP lo trate como nuevo registro (AUTO_INCREMENT)
        // Si tu PHP espera el ID manual, el servidor debería calcular el MAX(reg) + 1
        
        fetch('./php/procesar_sst.php', { method: 'POST', body: formData })
        .then(response => response.json())
        .then(data => {
            mostrarMensaje(data.mensaje, data.success);
            if (data.success) {
                formRegistro.reset();
                // Forzamos actualización para ver el nuevo registro con su ID real
                currentPage = 1; 
                fetchHeaders();
            }
        })
        .catch(error => {
            console.error('Error al registrar:', error);
            mostrarMensaje('Error de conexión al registrar.', false);
        });
    });

    // Cierre de Modales
    modalCloseButton.onclick = () => modalModificar.style.display = "none";
    window.onclick = (event) => { if (event.target == modalModificar) modalModificar.style.display = "none"; };

    function mostrarMensaje(mensaje, isSuccess) {
        mensajeStatus.textContent = mensaje;
        mensajeStatus.className = `message-box ${isSuccess ? 'success' : 'error'}`;
        setTimeout(() => { mensajeStatus.textContent = ''; mensajeStatus.className = ''; }, 5000);
    }

    function mostrarMensajeModal(mensaje, isSuccess) {
        modalMensajeStatus.textContent = mensaje;
        modalMensajeStatus.className = `message-box ${isSuccess ? 'success' : 'error'}`;
    }

    function generarPaginacion() {
        paginacionDiv.innerHTML = '';
        const totalPages = Math.ceil(totalRecords / recordsPerPage);
        if (totalPages <= 1) return;

        const btn = (text, targetPage, disabled) => {
            const b = document.createElement('button');
            b.textContent = text;
            b.disabled = disabled;
            b.onclick = () => { currentPage = targetPage; fetchDatos(); };
            return b;
        };

        paginacionDiv.appendChild(btn('Anterior', currentPage - 1, currentPage === 1));
        for (let i = 1; i <= totalPages; i++) {
            const p = btn(i, i, false);
            if (i === currentPage) p.classList.add('active');
            paginacionDiv.appendChild(p);
        }
        paginacionDiv.appendChild(btn('Siguiente', currentPage + 1, currentPage === totalPages));
    }

    function cargarSelectores() {
        fetch('./php/obtener_responsables.php')
            .then(response => response.json())
            .then(data => {
                idResponsableSelect.innerHTML = '<option value="">Selecciona un responsable</option>';
                data.forEach(res => {
                    const opt = document.createElement('option');
                    opt.value = res.id_usuario;
                    opt.textContent = res.nombre_usuario;
                    idResponsableSelect.appendChild(opt);
                });
            });
    }

    fetchHeaders();
});