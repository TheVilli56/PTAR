document.addEventListener('DOMContentLoaded', () => {
    // --- Referencias de Elementos ---
    const puntoSelect = document.getElementById('punto-grafica');
    const parametroSelect = document.getElementById('parametro-grafica');
    const fechaInicioInput = document.getElementById('fecha-inicio-grafica');
    const fechaFinInput = document.getElementById('fecha-fin-grafica');
    const generarBoton = document.getElementById('generar-grafica-sst');
    const descargarBoton = document.getElementById('descargar-grafica-sst');
    const canvas = document.getElementById('parametroChart');
    const promedioContainer = document.getElementById('promedio-container');
    let parametroChart = null; // Instancia de Chart.js

    // --- Mapeo de Parámetros y Tablas ---
    const mapeoParametros = {
        'csc': {
            'Tabla': 'csc', 
            'Parámetros': [
                { id: 'ddq', nombre: 'DDQ', unidad: 'mg/L' },
                { id: 'ph', nombre: 'pH', unidad: '' },
                { id: 't', nombre: 'Temperatura', unidad: '°C' }
            ]
        },
        'tec01': {
            'Tabla': 'tec01',
            'Parámetros': [
                { id: 'nivel', nombre: 'Nivel', unidad: 'm' },
                { id: 'ph', nombre: 'pH', unidad: '' },
                { id: 'dqo', nombre: 'DQO', unidad: 'mg/L' },
                { id: 't', nombre: 'Temperatura', unidad: '°C' }
            ]
        },
        'rec01': {
            'Tabla': 'rec01',
            'Parámetros': [
                { id: 'ssed', nombre: 'SSED', unidad: 'mL/L' },
                { id: 'od', nombre: 'OD', unidad: 'mg/L' },
                { id: 'ph', nombre: 'pH', unidad: '' },
                { id: 't', nombre: 'Temperatura', unidad: '°C' }
            ]
        },
        'rac': {
            'Tabla': 'rac',
            'Parámetros': [
                { id: 'ddq', nombre: 'DDQ', unidad: 'mg/L' },
                { id: 'ph', nombre: 'pH', unidad: '' },
                { id: 't', nombre: 'Temperatura', unidad: '°C' }
            ]
        }
    };

    // --- Funciones de Inicialización ---

    /**
     * Llena el select de parámetros al cambiar el punto de muestreo.
     */
    function actualizarParametros() {
        const puntoSeleccionado = puntoSelect.value;
        const info = mapeoParametros[puntoSeleccionado];

        parametroSelect.innerHTML = '<option value="">Selecciona un parámetro</option>';

        if (info && info.Parámetros) {
            info.Parámetros.forEach(p => {
                const option = document.createElement('option');
                option.value = p.id;
                option.textContent = `${p.nombre} (${p.unidad})`;
                parametroSelect.appendChild(option);
            });
        }
        // Ocultar botón de descarga y promedio al cambiar selección
        descargarBoton.style.display = 'none';
        promedioContainer.innerHTML = '';
        if (parametroChart) {
             parametroChart.destroy();
             parametroChart = null;
        }
    }

    /**
     * Inicializa las fechas con los valores por defecto (últimos 7 días).
     */
    function inicializarFechas() {
        const hoy = new Date();
        const haceSieteDias = new Date();
        haceSieteDias.setDate(hoy.getDate() - 7);

        const formatoFecha = (date) => {
            const y = date.getFullYear();
            const m = String(date.getMonth() + 1).padStart(2, '0');
            const d = String(date.getDate()).padStart(2, '0');
            return `${y}-${m}-${d}`;
        };

        fechaFinInput.value = formatoFecha(hoy);
        fechaInicioInput.value = formatoFecha(haceSieteDias);
    }

    // Inicialización al cargar
    puntoSelect.addEventListener('change', actualizarParametros);
    actualizarParametros(); // Carga inicial
    inicializarFechas();


    // --- Funciones de Dibujo y Descarga ---

    /**
     * Muestra el promedio del valor en el contenedor.
     * @param {Array<object>} datos - Los datos con el valor del parámetro.
     * @param {string} nombre - Nombre del parámetro.
     * @param {string} unidad - Unidad del parámetro.
     */
    function mostrarPromedio(datos, nombre, unidad) {
        const total = datos.reduce((sum, d) => sum + parseFloat(d.valor || 0), 0);
        const promedio = datos.length > 0 ? (total / datos.length) : 0;
        
        const promedioFormateado = promedio.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        promedioContainer.innerHTML = `
            <strong>Promedio de ${nombre} en el periodo:</strong> ${promedioFormateado} ${unidad}
        `;
    }

    /**
     * Dibuja o actualiza la gráfica de líneas.
     * @param {Array<object>} datos - Datos diarios.
     * @param {string} titulo - Título de la gráfica.
     * @param {string} parametroNombre - Nombre del parámetro para el eje Y.
     * @param {string} parametroUnidad - Unidad del parámetro.
     * @param {string} textColor - Color del texto (para exportación).
     * @param {string} lineColor - Color de la línea.
     */
    function dibujarGrafica(datos, titulo, parametroNombre, parametroUnidad, textColor = '#2b3b4f', lineColor = '#f7a900') {
        const labels = datos.map(d => d.fecha); // Eje X: Fechas
        const dataValues = datos.map(d => parseFloat(d.valor || 0)); // Eje Y: Valores

        if (datos.length === 0) {
            titulo = "No hay datos para el rango seleccionado";
            promedioContainer.innerHTML = '';
            descargarBoton.style.display = 'none';
        } else {
            mostrarPromedio(datos, parametroNombre, parametroUnidad);
            descargarBoton.style.display = 'inline-block';
        }

        const chartData = {
            labels: labels,
            datasets: [{
                label: `${parametroNombre} (${parametroUnidad})`,
                data: dataValues,
                borderColor: lineColor, 
                backgroundColor: 'rgba(247, 169, 0, 0.5)', 
                borderWidth: 3,
                tension: 0.3, // Curva suave
                pointRadius: 5,
                pointBackgroundColor: lineColor
            }]
        };

        const config = {
            type: 'line',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                backgroundColor: 'white', // Fondo del área de plot
                plugins: {
                    title: {
                        display: true,
                        text: titulo,
                        font: { size: 18, family: 'Roboto' },
                        color: textColor
                    },
                    legend: {
                        display: true,
                        labels: {
                            color: textColor 
                        }
                    },
                    tooltip: {
                         callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += context.parsed.y.toFixed(2) + parametroUnidad;
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: `${parametroNombre} ${parametroUnidad ? '(' + parametroUnidad + ')' : ''}`,
                            color: textColor 
                        },
                        ticks: {
                            color: textColor 
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Fecha (Día)', 
                            color: textColor 
                        },
                        ticks: {
                            color: textColor,
                            // Muestra solo las etiquetas de los días, ajusta si hay muchos puntos
                            maxRotation: 45,
                            minRotation: 45
                        }
                    }
                }
            }
        };

        if (parametroChart) {
            parametroChart.data = chartData;
            parametroChart.options.plugins.title.text = titulo;
            // Actualiza colores
            parametroChart.options.plugins.title.color = textColor;
            parametroChart.options.scales.y.title.color = textColor;
            parametroChart.options.scales.y.ticks.color = textColor;
            parametroChart.options.scales.x.title.color = textColor;
            parametroChart.options.scales.x.ticks.color = textColor;
            parametroChart.update();
        } else {
            parametroChart = new Chart(canvas, config);
        }
    }


    // --- Manejadores de Eventos ---

    generarBoton.addEventListener('click', async () => {
        const puntoMuestreo = puntoSelect.value;
        const parametroId = parametroSelect.value;
        const fechaInicio = fechaInicioInput.value;
        const fechaFin = fechaFinInput.value;
        
        if (!puntoMuestreo || !parametroId || !fechaInicio || !fechaFin) {
            dibujarGrafica([], 'Por favor, selecciona Punto de Muestreo, Parámetro y Fechas.', '', '');
            return;
        }

        const info = mapeoParametros[puntoMuestreo];
        const parametroInfo = info.Parámetros.find(p => p.id === parametroId);
        const tabla = info.Tabla;

        // Validación básica de fechas
        if (new Date(fechaInicio) > new Date(fechaFin)) {
            dibujarGrafica([], 'La fecha de inicio no puede ser posterior a la fecha fin.', '', '');
            return;
        }

        try {
            generarBoton.disabled = true;
            generarBoton.textContent = 'Cargando Datos...';

            const params = new URLSearchParams({
                tabla: tabla,
                parametro: parametroId,
                fecha_inicio: fechaInicio,
                fecha_fin: fechaFin
            });

            const response = await fetch(`./php/obtener_datos_grafica_sst.php?${params.toString()}`);
            
            if (!response.ok) {
                throw new Error(`Error HTTP del servidor: ${response.status} ${response.statusText}`);
            }

            const datos = await response.json();

            if (datos.error) {
                console.error('Error del servidor PHP:', datos.error);
                dibujarGrafica([], 'Error al cargar los datos: ' + datos.error, '', '');
                return;
            }

            const puntoNombre = puntoSelect.options[puntoSelect.selectedIndex].textContent.split('(')[0].trim();
            const titulo = `${parametroInfo.nombre} en ${puntoNombre} (${fechaInicio} a ${fechaFin})`;
            
            // Dibujar con colores de UI (texto oscuro)
            dibujarGrafica(datos, titulo, parametroInfo.nombre, parametroInfo.unidad, '#2b3b4f', '#06456f'); 

        } catch (error) {
            console.error('Ocurrió un error al intentar generar la gráfica:', error.message);
            dibujarGrafica([], 'Error al cargar los datos: ' + error.message, '', '');
        } finally {
            generarBoton.disabled = false;
            generarBoton.textContent = 'Generar Gráfica';
        }
    });

    descargarBoton.addEventListener('click', () => {
        if (parametroChart) {
            // Guardar la configuración actual de la gráfica en pantalla
            const originalOptions = JSON.parse(JSON.stringify(parametroChart.options));
            const originalData = JSON.parse(JSON.stringify(parametroChart.data));

            // Colores para la descarga: Fondo blanco, texto negro, línea azul
            const textColorExport = '#000000'; 
            const backgroundColorExport = 'white';
            const lineColorExport = '#06456f'; // Mantenemos el azul UNAM para la línea

            // 1. Ajustar colores temporalmente para el renderizado interno de Chart.js
            parametroChart.options.backgroundColor = backgroundColorExport; 
            parametroChart.options.plugins.title.color = textColorExport; 
            parametroChart.options.plugins.legend.labels.color = textColorExport;
            
            parametroChart.options.scales.y.title.color = textColorExport;
            parametroChart.options.scales.y.ticks.color = textColorExport;
            parametroChart.options.scales.x.title.color = textColorExport;
            parametroChart.options.scales.x.ticks.color = textColorExport;

            // Asegurar que la línea sea azul
            parametroChart.data.datasets[0].borderColor = lineColorExport;

            parametroChart.update(); 

            // 2. Generar Base64 forzando el fondo blanco (CAMBIO CLAVE)
            const url_base64 = parametroChart.toBase64Image('image/jpeg', 1.0, backgroundColorExport);
            
            // 3. Restaurar opciones originales
            parametroChart.options = originalOptions;
            parametroChart.data = originalData;
            parametroChart.update(); 

            // 4. Descargar
            const link = document.createElement('a');
            link.href = url_base64;
            
            const titulo = parametroChart.options.plugins.title.text || 'Grafica_SST';
            const nombreArchivo = titulo
                .replace(/[^a-z0-9]/gi, '_')
                .toLowerCase();

            link.download = `${nombreArchivo}.jpg`;
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            console.warn('No hay gráfica para descargar.');
        }
    });
});