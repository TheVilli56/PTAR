document.addEventListener('DOMContentLoaded', function() {
    const tablaSelect = document.getElementById('tabla');
    const insertarRegistroButton = document.getElementById('insertar-registro');
    const formularioInsertar = document.getElementById('formulario-insertar');
    const formularioDatosInsertar = document.getElementById('formulario-datos-insertar');
    const guardarNuevoButton = document.getElementById('guardar-nuevo');
    const cancelarInsertarButton = document.getElementById('cancelar-insertar');
    const tablaContenedor = document.getElementById('tabla-contenedor');

    let currentTable = '';

    insertarRegistroButton.addEventListener('click', function() {
        currentTable = tablaSelect.value;
        console.log('Tabla seleccionada para insertar:', currentTable);
        tablaContenedor.style.display = 'none';
        formularioInsertar.style.display = 'block';
        formularioDatosInsertar.innerHTML = ''; // Clear previous form

        // Generate empty input fields based on the selected table
        if (currentTable) {
            generarFormularioInsertar(currentTable);
        } else {
            alert('Por favor, selecciona una tabla antes de insertar.');
            formularioInsertar.style.display = 'none';
            tablaContenedor.style.display = 'block';
        }
    });

    cancelarInsertarButton.addEventListener('click', function() {
        formularioInsertar.style.display = 'none';
        tablaContenedor.style.display = 'block';
    });

    function generarFormularioInsertar(tabla) {
    fetch('php/obtener_columnas.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'tabla=' + encodeURIComponent(tabla)
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error('Error al obtener las columnas:', data.error);
            alert('Error al obtener las columnas de la tabla.');
            return;
        }

        formularioDatosInsertar.innerHTML = ''; // Targetting this form
        const headers = data.columns.map(column => column.Field).filter(field => field !== 'id');

        if (headers.length > 0) {
            headers.forEach(header => {
                const label = document.createElement('label');
                label.textContent = header.replace(/_/g, ' ');
                const input = document.createElement('input');
                input.type = 'text';
                input.name = header;

                formularioDatosInsertar.appendChild(label); // Appending to the form
                formularioDatosInsertar.appendChild(input); // Appending to the form
            });
        } else {
            formularioDatosInsertar.innerHTML = '<p>No hay campos para insertar en esta tabla.</p>';
        }
    })
    .catch(error => {
        console.error('Error de red:', error);
        alert('Error de red al obtener las columnas de la tabla.');
    });
}

    guardarNuevoButton.addEventListener('click', function() {
        if (currentTable) {
            const formData = new FormData(formularioDatosInsertar);
            formData.append('tabla', currentTable);

            fetch('php/insertar_datos.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error('Error al insertar el nuevo registro:', data.error);
                    alert('Error al insertar el nuevo registro.');
                } else {
                    alert('Nuevo registro insertado exitosamente.');
                    formularioInsertar.style.display = 'none';
                    tablaContenedor.style.display = 'block';
                    // We might need a way to trigger a data refresh in the main script
                    if (window.fetchDatos) {
                        window.fetchDatos(); // Assuming fetchDatos is in the main script
                    }
                }
            })
            .catch(error => {
                console.error('Error de red al insertar el nuevo registro:', error);
                alert('Error de red al insertar el nuevo registro.');
            });
        } else {
            alert('No se ha seleccionado ninguna tabla para insertar.');
        }
    });
});