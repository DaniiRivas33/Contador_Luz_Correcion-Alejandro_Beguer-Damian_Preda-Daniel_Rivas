// Variable totalcoste general
let totalCosteGeneral = 0;

// Función para actualizar costes
function actualizarTotalCosteGeneral() {
    let totalHabitaciones = 0;
    const habitaciones = document.querySelectorAll(".total-coste-habitacion");

    habitaciones.forEach(elem => {
        const totalHabitacion = parseFloat(elem.textContent.replace('Total: ', '').replace('€', '')) || 0;
        totalHabitaciones += totalHabitacion;
    });

    totalCosteGeneral = totalHabitaciones;
    document.getElementById("totalCoste").textContent = `Base imponible: ${totalCosteGeneral.toFixed(2)}€`;
    actualizarIva();
    actualizarTotalConIva();
}

// Función para Actualizar iva
function actualizarIva() {
    const iva = totalCosteGeneral * 0.21;
    document.getElementById("ivaCoste").textContent = `IVA (21%): ${iva.toFixed(2)}€`;
}

// Función para actualizar el total con iva
function actualizarTotalConIva() {
    const iva = totalCosteGeneral * 0.21;
    const totalConIva = totalCosteGeneral + iva;
    document.getElementById("totalConIva").textContent = `Total con IVA repercutido: ${totalConIva.toFixed(2)}€`;
}

// Función para actualizar el coste total de la habitación.
function actualizarTotalCosteHabitacion(id) {
    const totalElem = document.getElementById(`totalCosteHabitacion${id}`);
    const rows = document.getElementById(`tabla${id}`).querySelectorAll('tbody tr');
    let totalHabitacion = 0;

    rows.forEach(row => {
        const coste = parseFloat(row.querySelector('.coste').textContent.replace('€', '')) || 0;
        totalHabitacion += coste;
    });

    totalElem.textContent = `Total: ${totalHabitacion.toFixed(2)}€`;
    actualizarTotalCosteGeneral();
}

// Función para agregar habitaciones.
function agregarHabitacion() {
    const habitacionSelect = document.getElementById("seleccionarHabitacion");
    const nombreHabitacion = habitacionSelect.options[habitacionSelect.selectedIndex].text;
    const valorHabitacion = habitacionSelect.value;

    if (!valorHabitacion) {
        alert("Por favor, selecciona una habitación.");
        return;
    }

    // Verificar si la habitación ya existe
    const habitacionesExistentes = document.querySelectorAll(".appliance-box h2");
    for (let h of habitacionesExistentes) {
        if (h.textContent === nombreHabitacion) {
            alert(`Ya has añadido una habitación de tipo ${nombreHabitacion}. Elimina la existente antes de añadir otra.`);
            return;
        }
    }

    const contenedor = document.getElementById("habitaciones");
    const id = document.querySelectorAll(".appliance-box").length + 1;
    const div = document.createElement("div");
    div.className = "appliance-box";
    div.id = `habitacion${id}`;
    div.innerHTML = `
        <h2>${nombreHabitacion}</h2>
        <button class="eliminarhab">Eliminar habitación</button>
        <label class="texto">Precio kWh: <input class="input-field precio-kwh" type="number" step="0.01" id="precio${id}" value="0.15" min="0"></label>
        <h3>Electrodomésticos</h3>
        <button class="secboton" onclick="agregarElectrodomestico(${id})">Añadir Electrodoméstico</button>
        <input class="input-field" type="text" id="nombre${id}" placeholder="Nombre del electrodoméstico">
        <input class="input-field" type="number" id="potencia${id}" placeholder="Potencia (W)" step="0.01" min="0">
        <table class="appliance-table" id="tabla${id}">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Potencia (W)</th>
                    <th>Tiempo Encendido</th>
                    <th>Coste</th>
                    <th>Acción</th>
                    <th>Imagen</th>
                </tr>
            </thead>
            <tbody>
                ${obtenerElectrodomesticosPredefinidos(valorHabitacion, id)}
            </tbody>
        </table>
        <div id="totalCosteHabitacion${id}" class="total-coste-habitacion">Total: 0.00€</div>
    `;

    contenedor.appendChild(div);
    habitacionSelect.selectedIndex = 0;

    const nuevaTabla = document.getElementById(`tabla${id}`).querySelector('tbody');
    nuevaTabla.querySelectorAll('tr').forEach(fila => {
        addEventListenersToRow(fila, id);
    });

    div.querySelector(".eliminarhab").addEventListener("click", function() {
        eliminarHabitacion(id);
    });

    const inputPrecioKwh = div.querySelector(".precio-kwh");
    inputPrecioKwh.addEventListener("change", actualizarPreciosKwh);
}

// Función para actualizar el precio del kWh
function actualizarPreciosKwh(event) {
    const nuevoPrecio = parseFloat(event.target.value) || 0;
    const preciosKwh = document.querySelectorAll(".precio-kwh");

    preciosKwh.forEach(input => {
        input.value = nuevoPrecio.toFixed(2);
    });

    document.querySelectorAll(".appliance-box").forEach((elem, id) => {
        actualizarTotalCosteHabitacion(id + 1);
    });
}

// Función para eliminar habitaciónes.
function eliminarHabitacion(id) {
    const habitacion = document.getElementById(`habitacion${id}`);
    habitacion.parentNode.removeChild(habitacion);
    actualizarTotalCosteGeneral();
}

// Función para gestión de habitaciones y electrodomésticos
function obtenerElectrodomesticosPredefinidos(habitacion, id) {
    const electrodomesticos = {
        cocina: [
            { nombre: "Lavadora", potencias: [1500, 2000, 2500], imagen: "Imagenes/lavadora.webp"},
            { nombre: "Airfryer", potencias: [800, 900, 1000], imagen: "Imagenes/airfryer.webp"},
            { nombre: "Horno", potencias: [2000, 3500, 5000], imagen: "Imagenes/horno.jpeg"},
        ],
        salon: [
            { nombre: "Televisión", potencias: [100, 150, 200], imagen: "Imagenes/television.jpeg"},
            { nombre: "Lámpara", potencias: [60, 75, 100], imagen: "Imagenes/lampara.jpg"},
            { nombre: "Altavoces", potencias: [50, 70, 90], imagen: "Imagenes/altavoces.jpg"}
        ],
        baño: [
            { nombre: "Toallero", potencias: [750, 1000, 1500], imagen: "Imagenes/toallero.jpg"},
            { nombre: "Termo", potencias: [1500, 2000, 2500], imagen: "Imagenes/termo.jpg"},
            { nombre: "Lámpara", potencias: [60, 75, 100], imagen: "Imagenes/lampara.jpg"}
        ],
        dormitorio1: [
            { nombre: "Climatizador", potencias: [1000, 1500, 2000], imagen: "Imagenes/climatizador.jpg"},
            { nombre: "Ventilador", potencias: [50, 75, 100], imagen: "Imagenes/ventilador.jpg"},
            { nombre: "Lámpara", potencias: [50, 70, 90], imagen: "Imagenes/lampara.jpg"}
        ],
        dormitorio2: [
            { nombre: "Portatil", potencias: [45, 60, 75], imagen: "Imagenes/portatil.jpeg"},
            { nombre: "Humedificador", potencias: [25, 35, 50], imagen: "Imagenes/humedificador.webp"},
            { nombre: "Calefactor", potencias: [750, 1000, 1500], imagen: "Imagenes/calefactor.jpeg"}
        ],
        patio: [
            { nombre: "Parrilla eléctrica", potencias: [1000, 1500, 2000], imagen: "Imagenes/parrilla.jpeg"},
            { nombre: "Calefactor", potencias: [800, 1200, 1500], imagen: "Imagenes/calefactor.jpeg"},
            { nombre: "Luces Jardín", potencias: [10, 20, 30], imagen: "Imagenes/luzjardin.jpg"}
        ],
        guardilla: [
            { nombre: "Deshumidificador", potencias: [200, 300, 400], imagen: "Imagenes/deshumidificador.jpeg"},
            { nombre: "Ventilador techo", potencias: [50, 75, 100], imagen: "Imagenes/ventiladortecho.jpg"},
            { nombre: "Calefactor portátil", potencias: [500, 1000, 1500], imagen: "Imagenes/calefactor.jpeg"}
        ],
        sotano: [
            { nombre: "Deshumidificador", potencias: [200, 300, 400], imagen: "Imagenes/deshumidificador.jpeg"},
            { nombre: "Congelador", potencias: [300, 400, 500], imagen: "Imagenes/congelador.jpg"},
            { nombre: "Lámpara de Pie", potencias: [50, 70, 80], imagen: "Imagenes/lampara.jpg"}
        ],
    };

    if (!electrodomesticos[habitacion]) return '';

    return electrodomesticos[habitacion].map(e => `
        <tr>
            <td>${e.nombre}</td>
            <td>
                <select class="potencia-dropdown">
                    ${e.potencias.map(p => `<option value="${p}">${p}</option>`).join('')}
                </select>
            </td>
            <td class="tiempo">0s</td>
            <td class="coste">0.00€</td>
            <td>
                <button class="secboton toggle">On</button>
                <button class="secboton eliminar">Delete</button>
                <button class="secboton acelerar" data-velocidad="1">x1</button>
                <button class="secboton añadirhora">+1h</button>
            </td>
            <td><img src="${e.imagen}" alt="${e.nombre}" style="width:50px; height:auto;"></td>
        </tr>
    `).join('');
}

// Función para agregar nuevos electrodomésticos
function agregarElectrodomestico(id) {
    const nombre = document.getElementById(`nombre${id}`).value;
    const potencia = parseFloat(document.getElementById(`potencia${id}`).value);
    if (!nombre || isNaN(potencia) || potencia <= 0) {
        alert("Por favor, ingresa un nombre válido y una potencia positiva.");
        return;
    }

    const tabla = document.getElementById(`tabla${id}`).querySelector('tbody');
    const fila = document.createElement("tr");
    let encendido = false;
    let tiempoEncendido = 0;
    let intervalo;
    let velocidad = 1;

    fila.innerHTML = `
        <td>${nombre}</td>
        <td>
            <select class="potencia-dropdown">
                <option value="${potencia}">${potencia}</option>
            </select>
        </td>
        <td class="tiempo">0s</td>
        <td class="coste">0.00€</td>
        <td>
            <button class="secboton toggle">On</button>
            <button class="secboton eliminar">Delete</button>
            <button class="secboton acelerar" data-velocidad="1">x1</button>
            <button class="secboton añadirhora">+1h</button>
        </td>
    `;

    // Aquí se asegura que se añadan los event listeners a la nueva fila
    addEventListenersToRow(fila, id);
    tabla.appendChild(fila);
    actualizarTotalCosteHabitacion(id);
}

// Función para crear eventos
function addEventListenersToRow(fila, id) {
    let encendido = false;
    let tiempoEncendido = 0;
    let intervalo;
    let velocidad = 1;

    const botonToggle = fila.querySelector(".toggle");
    const botonAcelerar = fila.querySelector(".acelerar");
    const tiempoElem = fila.querySelector(".tiempo");
    const costeElem = fila.querySelector(".coste");
    const botonAñadirHora = fila.querySelector(".añadirhora");

    botonToggle.addEventListener("click", () => {
        const precioKwH = parseFloat(document.getElementById(`precio${id}`).value);
        const potenciaSeleccionada = parseFloat(fila.querySelector('.potencia-dropdown').value);

        if (!encendido) {
            // Iniciar el intervalo para actualizar el tiempo
            intervalo = setInterval(() => {
                tiempoEncendido += velocidad; // Incrementar el tiempo según la velocidad
                let horas = Math.floor(tiempoEncendido / 3600);
                let minutos = Math.floor((tiempoEncendido % 3600) / 60);
                let segundos = tiempoEncendido % 60;
                let consumoKWh = (potenciaSeleccionada / 1000) * (tiempoEncendido / 3600);
                let coste = (consumoKWh * precioKwH).toFixed(2);
                
                // Actualizar el tiempo y coste en la interfaz
                tiempoElem.textContent = `${horas}h ${minutos}m ${segundos}s`;
                costeElem.textContent = `${coste}€`;
                actualizarTotalCosteHabitacion(id);
            }, 1000); // Mantener el intervalo cada segundo
            botonToggle.textContent = "Off";
            fila.classList.add("on");
        } else {
            clearInterval(intervalo);
            botonToggle.textContent = "On";
            fila.classList.remove("on");
        }

        encendido = !encendido;
    });

    botonAcelerar.addEventListener("click", () => {
        if (!encendido) return;

        // Cambiar la velocidad sin detener el intervalo
        switch (velocidad) {
            case 1:
                velocidad = 2;
                botonAcelerar.textContent = "x2";
                break;
            case 2:
                velocidad = 5;
                botonAcelerar.textContent = "x5";
                break;
            case 5:
                velocidad = 10;
                botonAcelerar.textContent = "x10";
                break;
            case 10:
                velocidad = 30;
                botonAcelerar.textContent = "x30";
                break;
            case 30:
                velocidad = 60;
                botonAcelerar.textContent = "x60";
                break;
            case 60:
                velocidad = 90;
                botonAcelerar.textContent = "x90";
                break;
            default:
                velocidad = 1;
                botonAcelerar.textContent = "x1";
        }

        // No reiniciar el intervalo, solo cambiar la velocidad
    });

    botonAñadirHora.addEventListener("click", () => {
        if (!encendido) return; // Solo añadir tiempo si el electrodoméstico está encendido

        // Añadir 3600 segundos (1 hora) al tiempo de encendido
        tiempoEncendido += 3600;

        // Actualizar el tiempo en la interfaz
        let horas = Math.floor(tiempoEncendido / 3600);
        let minutos = Math.floor((tiempoEncendido % 3600) / 60);
        let segundos = tiempoEncendido % 60;

        tiempoElem.textContent = `${horas}h ${minutos}m ${segundos}s`;

        // Calcular el coste basado en el nuevo tiempo
        const precioKwH = parseFloat(document.getElementById(`precio${id}`).value);
        const potenciaSeleccionada = parseFloat(fila.querySelector('.potencia-dropdown').value);
        let consumoKWh = (potenciaSeleccionada / 1000) * (tiempoEncendido / 3600);
        let coste = (consumoKWh * precioKwH).toFixed(2);
        costeElem.textContent = `${coste}€`;

        // Actualizar el coste total de la habitación
        actualizarTotalCosteHabitacion(id);
    });

    const botonEliminar = fila.querySelector(".eliminar");
    botonEliminar.addEventListener("click", () => {
        fila.remove();
        actualizarTotalCosteHabitacion(id);
    });
}
// Función para resetear el total general
function resetearTotalGeneral() {
    totalCosteGeneral = 0;
    document.getElementById("totalCoste").textContent = `Importe Total Facturación: 0.00 €`;
    document.getElementById("ivaCoste").textContent = `IVA (21%): 0.00 €`;
    document.getElementById("totalConIva").textContent = `Total con IVA: 0.00 €`;
}

document.querySelectorAll('tbody tr').forEach(fila => {
    const id = fila.closest('table').id.replace('tabla', '');
    addEventListenersToRow(fila, id);
});