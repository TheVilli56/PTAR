document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los elementos del DOM
    const zonaSelect = document.getElementById('zona-grafica');
    const mesInicioSelect = document.getElementById('mes-inicio-grafica');
    const anioInicioSelect = document.getElementById('anio-inicio-grafica');
    const mesFinSelect = document.getElementById('mes-fin-grafica');
    const anioFinSelect = document.getElementById('anio-fin-grafica');
    const generarBoton = document.getElementById('generar-grafica');
    const canvas = document.getElementById('volumenRiegoChart');
    let volumenRiegoChart = null; // Variable para almacenar la instancia del gráfico
    
    // NUEVOS ELEMENTOS DEL DOM PARA LOS REQUERIMIENTOS
    const totalVolumenContainer = document.getElementById('total-volumen-container');
    const descargarBoton = document.getElementById('descargar-grafica');


    const nombresMeses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    // --- Funciones de Inicialización (se mantienen iguales) ---
    function llenarSelectMeses(selectElement) {
        selectElement.innerHTML = '';
        nombresMeses.forEach((nombre, index) => {
            const option = document.createElement('option');
            option.value = index + 1;
            option.textContent = nombre;
            selectElement.appendChild(option);
        });
        selectElement.value = new Date().getMonth() + 1;
    }

    function llenarSelectAnios(selectElement) {
        selectElement.innerHTML = '';
        const currentYear = new Date().getFullYear();
        for (let i = 0; i < 5; i++) {
            const year = currentYear - i;
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            selectElement.appendChild(option);
        }
        selectElement.value = currentYear;
    }

    async function cargarZonasRiego() {
        try {
            const response = await fetch('./php/obtener_zonas.php'); 
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
            }
            const zonas = await response.json();
            zonaSelect.innerHTML = '<option value="todos">Todas las Zonas</option>'; 
            if (Array.isArray(zonas)) {
                zonas.forEach(zona => {
                    const option = document.createElement('option');
                    if (zona.id_zona && zona.nombre_zona) {
                        option.value = zona.id_zona; 
                        option.textContent = zona.nombre_zona; 
                        zonaSelect.appendChild(option);
                    }
                });
            } else {
                console.error('La respuesta de obtener_zonas.php no es un array válido:', zonas);
            }
        } catch (error) {
            console.error('Error al cargar las zonas de riego. Falló la conexión o el parseo JSON:', error);
        }
    }

    // Inicializar los selects
    llenarSelectMeses(mesInicioSelect);
    llenarSelectAnios(anioInicioSelect);
    llenarSelectMeses(mesFinSelect);
    llenarSelectAnios(anioFinSelect);
    cargarZonasRiego();

    // --- Funciones de Cálculo y Presentación ---

    /**
     * Calcula y muestra el volumen total utilizado.
     * @param {Array<object>} datos - Los datos de volumen por mes.
     */
    function mostrarVolumenTotal(datos) {
        const total = datos.reduce((sum, d) => sum + parseFloat(d.volumen_total || 0), 0);
        
        // Formato para dos decimales
        const totalFormateado = total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        totalVolumenContainer.innerHTML = `
            <p><strong>Volumen Total utilizado en el periodo:</strong> ${totalFormateado} m³</p>
        `;
    }


    /**
     * Dibuja o actualiza el histograma con los datos proporcionados.
     * @param {Array<object>} datos - Los datos de volumen por mes.
     * @param {string} titulo - Título de la gráfica.
     * @param {string} textColor - Color del texto para la gráfica (útil para descarga).
     * @param {string} backgroundColor - Color de fondo de la gráfica (útil para descarga).
     */
    function dibujarGrafica(datos, titulo, textColor = '#2b3b4f', backgroundColor = 'rgba(255, 255, 255, 0.9)') {
        // Mapea los datos.
        const labels = datos.map(d => `${nombresMeses[d.mes - 1]} - ${d.anio} (${parseFloat(d.volumen_total || 0).toFixed(2)} m³)`);
        const dataValues = datos.map(d => parseFloat(d.volumen_total || 0)); 
        
        // Si no hay datos, ajusta el título
        if (datos.length === 0) {
            titulo = "No hay datos para el rango seleccionado";
            // Limpia el contenedor de volumen total
            totalVolumenContainer.innerHTML = '';
        } else {
            // Muestra el volumen total si hay datos
            mostrarVolumenTotal(datos);
        }

        const chartData = {
            labels: labels,
            datasets: [{
                label: 'Volumen Total Usado (m³)',
                data: dataValues,
                backgroundColor: '#06456f', // Azul UNAM
                borderColor: '#06456f',
                borderWidth: 1,
            }]
        };

        const config = {
            type: 'bar',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                backgroundColor: backgroundColor, // Fondo del área del gráfico
                plugins: {
                    title: {
                        display: true,
                        text: titulo,
                        font: {
                            size: 18,
                            family: 'Roboto'
                        },
                        color: textColor // Color del título
                    },
                    legend: {
                        display: false
                    },
                    // Personalización del Tooltip para mostrar datos al pasar el ratón
                    tooltip: {
                         callbacks: {
                            // Muestra el valor exacto en el tooltip
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += context.parsed.y.toFixed(2) + ' m³';
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Volumen (m³)',
                            color: textColor // Color del título del eje Y
                        },
                        ticks: {
                            color: textColor // Color de las etiquetas del eje Y
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            // El volumen se incluye en la etiqueta para cumplir el requerimiento
                            text: 'Mes y Año (Volumen Usado)', 
                            color: textColor // Color del título del eje X
                        },
                        ticks: {
                            color: textColor // Color de las etiquetas del eje X
                        }
                    }
                }
            }
        };

        if (volumenRiegoChart) {
            volumenRiegoChart.data = chartData;
            volumenRiegoChart.options.plugins.title.text = titulo;
            // Actualiza los colores al actualizar la gráfica
            volumenRiegoChart.options.plugins.title.color = textColor;
            volumenRiegoChart.options.scales.y.title.color = textColor;
            volumenRiegoChart.options.scales.y.ticks.color = textColor;
            volumenRiegoChart.options.scales.x.title.color = textColor;
            volumenRiegoChart.options.scales.x.ticks.color = textColor;
            volumenRiegoChart.options.backgroundColor = backgroundColor;


            volumenRiegoChart.update();
        } else {
            volumenRiegoChart = new Chart(canvas, config);
        }
    }

    /**
     * Manejador del botón para generar la gráfica.
     */
    generarBoton.addEventListener('click', async () => {
        // ... (Lógica de obtención de parámetros y validación de fechas - se mantiene) ...
        const idZona = zonaSelect.value;
        const mesInicio = mesInicioSelect.value;
        const anioInicio = anioInicioSelect.value;
        const mesFin = mesFinSelect.value;
        const anioFin = anioFinSelect.value;

        const fechaInicio = new Date(anioInicio, mesInicio - 1);
        const fechaFin = new Date(anioFin, mesFin - 1);
        
        if (fechaInicio > fechaFin) {
            dibujarGrafica([], 'El rango de fechas es inválido. Ajuste el mes/año de inicio.');
            return;
        }

        try {
            generarBoton.disabled = true;
            generarBoton.textContent = 'Cargando...';

            const params = new URLSearchParams({
                id_zona: idZona,
                mes_inicio: mesInicio,
                anio_inicio: anioInicio,
                mes_fin: mesFin,
                anio_fin: anioFin
            });

            const response = await fetch(`./php/obtener_datos_grafica_riego.php?${params.toString()}`);
            
            if (!response.ok) {
                throw new Error(`Error HTTP del servidor: ${response.status} ${response.statusText}`);
            }

            const datos = await response.json();

            if (datos.error) {
                console.error('Error del servidor PHP (datos.error):', datos.error);
                dibujarGrafica([], 'Error del servidor: ' + datos.error);
                return;
            }

            const nombreZona = idZona === 'todos' ? 'Todas las Zonas' : zonaSelect.options[zonaSelect.selectedIndex].text;
            const titulo = `Volumen de Riego en ${nombreZona} (${nombresMeses[mesInicio - 1]}/${anioInicio} - ${nombresMeses[mesFin - 1]}/${anioFin})`;
            
            // Al dibujar la gráfica en la UI, usa los colores por defecto (oscuros)
            dibujarGrafica(datos, titulo, '#2b3b4f', 'rgba(255, 255, 255, 0.9)'); 

        } catch (error) {
            console.error('Ocurrió un error al intentar generar la gráfica:', error.message);
            dibujarGrafica([], 'Error al cargar los datos: ' + error.message);
        } finally {
            generarBoton.disabled = false;
            generarBoton.textContent = 'Generar Gráfica';
        }
    });

    /**
     * Lógica del botón de descarga.
     */
    descargarBoton.addEventListener('click', () => {
        if (volumenRiegoChart) {
            // Guardar la configuración actual de la gráfica
            const originalOptions = JSON.parse(JSON.stringify(volumenRiegoChart.options));
            const originalData = JSON.parse(JSON.stringify(volumenRiegoChart.data));

            // TEMPORALMENTE ajustar las opciones para la descarga
            volumenRiegoChart.options.backgroundColor = "#ffffff"; // Fondo blanco
            volumenRiegoChart.options.plugins.title.color = '#ffffff'; // Título negro
            
            // Ajustar colores de los ejes y etiquetas
            volumenRiegoChart.options.scales.y.title.color = '#00000000';
            volumenRiegoChart.options.scales.y.ticks.color = '#000000';
            volumenRiegoChart.options.scales.x.title.color = '#000000';
            volumenRiegoChart.options.scales.x.ticks.color = '#ffffff';
            
            volumenRiegoChart.update(); // Aplicar los cambios temporalmente

            // Obtener la URL de la imagen del canvas con la nueva configuración
            const url_base64 = volumenRiegoChart.toBase64Image('image/jpeg', 1.0, "#ffffff");
            
            // Restaurar las opciones originales de la gráfica para la visualización en pantalla
            volumenRiegoChart.options = originalOptions;
            volumenRiegoChart.data = originalData;
            volumenRiegoChart.update(); // Volver a dibujar con la configuración original

            // Crear un enlace temporal para la descarga
            const link = document.createElement('a');
            link.href = url_base64;
            
            let nombreArchivo = 'grafica_riego';
            if (volumenRiegoChart.options.plugins.title.text && volumenRiegoChart.options.plugins.title.text !== "No hay datos para el rango seleccionado") {
                nombreArchivo = volumenRiegoChart.options.plugins.title.text
                    .replace(/[^a-z0-9]/gi, '_') 
                    .toLowerCase();
            }

            link.download = `${nombreArchivo}.jpg`;
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            console.warn('No hay gráfica para descargar.');
        }
    });

    // Inicia la gráfica al cargar la página (con los valores por defecto)
    setTimeout(() => {
        if (generarBoton) {
            generarBoton.click(); 
        }
    }, 500);

});