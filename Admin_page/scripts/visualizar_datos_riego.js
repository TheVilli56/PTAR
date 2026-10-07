document.addEventListener('DOMContentLoaded', function() {
    // --- 1. Selectores y Variables de la Aplicación ---
    
    // Selectores para la navegación entre secciones (Mantenidos)
    const navLinks = document.querySelectorAll('.sub-nav-link');
    const sections = document.querySelectorAll('.content-section');

    // Selectores para la sección de Visualizar Datos
    const mesSelect = document.getElementById('mes');
    const anioSelect = document.getElementById('anio');
    const buscarButton = document.getElementById('buscar-datos');
    const tablaDatosBody = document.getElementById('tabla-datos').getElementsByTagName('tbody')[0];
    const tablaDatosHeadRow = document.getElementById('tabla-datos').getElementsByTagName('thead')[0].getElementsByTagName('tr')[0];
    const paginacionDiv = document.querySelector('.paginacion');

    // Selectores para la sección de Registrar Datos (Mantenidos)
    const formRegistro = document.getElementById('form-registro');
    const formEliminar = document.getElementById('form-eliminar');
    const mensajeStatus = document.getElementById('mensaje-status');
    const idResponsableSelect = document.getElementById('id_responsable');
    const idZonaSelect = document.getElementById('id_zona');

    // Variables de estado para la paginación y la tabla
    let currentPage = 1;
    const recordsPerPage = 10;
    let totalRecords = 0;
    const tabla = 'registro_operacion'; 
    
    // ORDEN DE COLUMNAS DEFINIDO MANUALMENTE PARA RIEGO
    const RIEGO_HEADERS = [
        { key: 'id', name: 'ID' },
        { key: 'fecha', name: 'Fecha' },
        { key: 'hora_inicio', name: 'Inicio' },
        { key: 'hora_termino', name: 'Término' },
        { key: 'zona_nombre', name: 'Zona' }, // Asume que el PHP devuelve 'zona_nombre'
        { key: 'bomba_presion_bcm_01a', name: 'Bomba A' },
        { key: 'bomba_presion_bcm_01b', name: 'Bomba B' },
        { key: 'bomba_presion_bcm_01r', name: 'Bomba R' },
        { key: 'nivel_tac_01_inicio', name: 'Nivel Inicial' },
        { key: 'nivel_tac_01_termino', name: 'Nivel Final' },
        { key: 'volumen_usado', name: 'Vol. Usado (M³)' },
        { key: 'responsable_nombre', name: 'Responsable' }, // Asume que el PHP devuelve 'responsable_nombre'
    ];

    // --- 2. Lógica de Navegación entre Secciones (Mantenida) ---

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            sections.forEach(section => section.classList.remove('active'));
            navLinks.forEach(link => link.classList.remove('active'));
            
            const targetId = link.getAttribute('href').substring(1);
            document.getElementById(targetId).classList.add('active');
            link.classList.add('active');
            
            if (targetId === 'visualizar-datos') {
                // Ya no necesitamos fetchHeaders, solo fetchDatos
                fetchDatos(); 
            } else if (targetId === 'registrar-datos') {
                cargarSelectores();
            }
        });
    });

    // --- 3. Funciones para la Sección de Visualizar Datos ---
    
    buscarButton.addEventListener('click', function() {
        currentPage = 1;
        fetchDatos();
    });

    // Eliminamos fetchHeaders() ya que el orden de columnas es fijo (RIEGO_HEADERS)

    function fetchDatos() {
        const mes = mesSelect.value;
        const anio = anioSelect.value;

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
        .then(response => {
            const clonedResponse = response.clone();
            return response.json().catch(() => {
                clonedResponse.text().then(text => {
                    console.error('La respuesta del servidor no es un JSON válido. Contenido recibido:', text);
                });
                throw new Error('Respuesta no es JSON válido');
            });
        })
        .then(data => {
            if (data.error) {
                console.error('Error al obtener los datos:', data.error);
                tablaDatosBody.innerHTML = `<tr><td colspan="13">Error al cargar los datos: ${data.error}</td></tr>`;
                paginacionDiv.innerHTML = '';
                return;
            }
            // Asegúrate de que el PHP devuelva 'totalRecords'
            totalRecords = data.totalRecords || 0; 
            mostrarDatos(data.datos);
            generarPaginacion();
        })
        .catch(error => {
            console.error('Error de red o de JSON:', error);
            tablaDatosBody.innerHTML = `<tr><td colspan="13">Error al cargar los datos.</td></tr>`;
            paginacionDiv.innerHTML = '';
        });
    }

    function mostrarDatos(datos) {
        tablaDatosBody.innerHTML = '';
        tablaDatosHeadRow.innerHTML = '';

        // 1. Generar Encabezados de Tabla (Fijos)
        RIEGO_HEADERS.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header.name;
            tablaDatosHeadRow.appendChild(th);
        });
        // Añadir la columna de Acciones
        const thAcciones = document.createElement('th');
        thAcciones.textContent = 'Acciones';
        tablaDatosHeadRow.appendChild(thAcciones);


        if (datos && datos.length > 0) {
            // 2. Generar Filas de Datos
            datos.forEach(rowData => {
                const tr = document.createElement('tr');
                
                // Celdas de Datos
                RIEGO_HEADERS.forEach(header => {
                    const td = document.createElement('td');
                    // Usar .toFixed(2) para los valores numéricos si es necesario
                    let value = rowData[header.key] !== undefined ? rowData[header.key] : '';
                    if (['bomba_presion_bcm_01a', 'bomba_presion_bcm_01b', 'bomba_presion_bcm_01r', 'nivel_tac_01_inicio', 'nivel_tac_01_termino', 'volumen_usado'].includes(header.key) && value !== '') {
                         td.textContent = parseFloat(value).toFixed(2);
                    } else {
                        td.textContent = value;
                    }
                    tr.appendChild(td);
                });
                
                // Celda de Acciones (Modificar/Eliminar)
                const tdAcciones = document.createElement('td');
                tdAcciones.innerHTML = `
                    <button class="btn btn-primary btn-sm modificar-riego" data-id="${rowData.id}">Modificar</button>
                    <button class="btn btn-danger btn-sm eliminar-riego" data-id="${rowData.id}">Eliminar</button>
                `;
                tr.appendChild(tdAcciones);
                tablaDatosBody.appendChild(tr);
            });
        } else {
            const colspan = RIEGO_HEADERS.length + 1; // 13 columnas de datos + 1 de acciones
            tablaDatosBody.innerHTML = `<tr><td colspan="${colspan}">No se encontraron datos con los filtros seleccionados.</td></tr>`;
        }
    }

    // --- Lógica para manejar los clics en los botones de Acciones (Modificar/Eliminar) ---
    // ESTO DEBE ESTAR EN TU ARCHIVO JS QUE MANEJA EL CRUD (p.ej. riego.js o en este mismo)

    $(document).on('click', '.modificar-riego', function() {
        const idRegistro = $(this).data('id');
        // Aquí deberías llamar a una función para abrir el modal y cargar datos
        // openModalModificar(idRegistro); 
        console.log('Modificar ID:', idRegistro);
    });

    $(document).on('click', '.eliminar-riego', function() {
        const idRegistro = $(this).data('id');
        if (confirm(`¿Estás seguro de que quieres eliminar el registro ID ${idRegistro}?`)) {
            // Llamar a la función de eliminación
            eliminarRegistro(idRegistro);
        }
    });

    function eliminarRegistro(id) {
        const formData = new FormData();
        formData.append('accion', 'eliminar');
        formData.append('id', id); // Usamos 'id' como se definió en procesar_riego.php

        fetch('php/procesar_riego.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            mostrarMensaje(data.mensaje, data.success);
            if (data.success) {
                fetchDatos(); // Recargar la tabla
            }
        })
        .catch(error => {
            console.error('Error al eliminar:', error);
            mostrarMensaje('Error de conexión al intentar eliminar.', false);
        });
    }

    // --- Lógica de Paginación (Mejorada) ---

    function generarPaginacion() {
        paginacionDiv.innerHTML = '';
        const totalPages = Math.ceil(totalRecords / recordsPerPage);

        if (totalPages > 1) {
            // Utilizamos la estructura simple de botones
            const ul = document.createElement('ul');
            ul.classList.add('pagination-list'); // Clase para estilos, si usas Bootstrap usa 'pagination'

            const prevButton = createPaginationButton('Anterior', currentPage - 1, currentPage === 1);
            ul.appendChild(prevButton);

            const maxPagesToShow = 5;
            let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
            let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

            if (endPage - startPage + 1 < maxPagesToShow) {
                startPage = Math.max(1, endPage - maxPagesToShow + 1);
            }

            for (let i = startPage; i <= endPage; i++) {
                const button = createPaginationButton(i, i, i === currentPage);
                ul.appendChild(button);
            }

            const nextButton = createPaginationButton('Siguiente', currentPage + 1, currentPage === totalPages);
            ul.appendChild(nextButton);

            paginacionDiv.appendChild(ul);
        }
    }

    function createPaginationButton(text, pageNum, isActiveOrDisabled) {
        const li = document.createElement('li');
        const button = document.createElement('button');
        button.textContent = text;
        button.dataset.page = pageNum;
        button.classList.add('pagination-button'); // Clase para estilos

        if (isActiveOrDisabled) {
            button.disabled = true;
            if (text === currentPage) {
                 button.classList.add('active'); 
            }
        }
        
        button.addEventListener('click', function() {
            currentPage = pageNum;
            fetchDatos();
        });
        
        li.appendChild(button);
        return li;
    }


    // ... (El resto del código de registro y utilidades se mantiene sin cambios) ...

    // --- 5. Lógica de Inicialización de la Página ---

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
    
    // Función para mostrar mensajes de estado (Mantenida)
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
    
    // Inicialización al cargar la página (Cambiado de fetchHeaders a fetchDatos)
    const visualizarLink = document.querySelector('a[href="#visualizar-datos"]');
    if (visualizarLink) {
        visualizarLink.classList.add('active');
    }
    const visualizarSection = document.getElementById('visualizar-datos');
    if (visualizarSection) {
        visualizarSection.classList.add('active');
    }
    
    fetchDatos(); // Llama a fetchDatos directamente para cargar la tabla al inicio.

});