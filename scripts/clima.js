// =============================================
// DATOS DE CIUDADES DE MENDOZA POR ZONA
// =============================================
const ciudadesMendoza = {
    "norte": [
        { nombre: "Mendoza Capital", lat: -32.8908, lng: -68.8272 },
        { nombre: "Guaymallén", lat: -32.8847, lng: -68.8272 },
        { nombre: "Godoy Cruz", lat: -32.9333, lng: -68.8333 },
        { nombre: "Las Heras", lat: -32.8500, lng: -68.8167 },
        { nombre: "Maipú", lat: -32.9667, lng: -68.7500 },
        { nombre: "Luján de Cuyo", lat: -33.0333, lng: -68.8833 },
        { nombre: "Lavalle", lat: -32.7000, lng: -68.5833 }
    ],
    "centro": [
        { nombre: "Tunuyán", lat: -33.5667, lng: -69.0167 },
        { nombre: "Tupungato", lat: -33.3667, lng: -69.1500 },
        { nombre: "San Carlos", lat: -33.7667, lng: -69.0333 }
    ],
    "este": [
        { nombre: "Junín", lat: -33.1500, lng: -68.4833 },
        { nombre: "Rivadavia", lat: -33.1833, lng: -68.4667 },
        { nombre: "San Martín", lat: -33.0833, lng: -68.4667 },
        { nombre: "Santa Rosa", lat: -33.2500, lng: -68.1500 },
        { nombre: "La Paz", lat: -33.4667, lng: -67.5500 }
    ],
    "sur": [
        { nombre: "San Rafael", lat: -34.6177, lng: -68.3301 },
        { nombre: "General Alvear", lat: -34.9667, lng: -67.7000 },
        { nombre: "Malargüe", lat: -35.4667, lng: -69.5833 }
    ]
};

// =============================================
// FUNCIÓN: ESCAPAR HTML
// =============================================
function escapeHtml(str) {
    if (!str) return "";
    return String(str)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

// =============================================
// ICONO SEGÚN CÓDIGO
// =============================================
function obtenerIconoClima(codigoClima) {
    if (codigoClima === 0) return "☀️";
    if (codigoClima >= 1 && codigoClima <= 3) return "🌤️";
    if (codigoClima >= 45 && codigoClima <= 48) return "🌫️";
    if (codigoClima >= 51 && codigoClima <= 67) return "🌧️";
    if (codigoClima >= 71 && codigoClima <= 77) return "❄️";
    if (codigoClima >= 80 && codigoClima <= 82) return "⛈️";
    if (codigoClima >= 95 && codigoClima <= 99) return "⚡";
    return "🌈";
}

// =============================================
// DESCRIPCIÓN SEGÚN CÓDIGO
// =============================================
function obtenerDescripcionClima(codigoClima) {
    const descripciones = {
        0: "Despejado", 1: "Mayormente despejado", 2: "Parcialmente nublado", 3: "Nublado",
        45: "Niebla", 48: "Niebla helada", 51: "Llovizna ligera", 53: "Llovizna moderada",
        55: "Llovizna intensa", 61: "Lluvia ligera", 63: "Lluvia moderada", 65: "Lluvia intensa",
        71: "Nieve ligera", 73: "Nieve moderada", 75: "Nieve intensa", 77: "Granizo",
        80: "Chubascos ligeros", 81: "Chubascos moderados", 82: "Chubascos intensos",
        95: "Tormenta eléctrica", 96: "Tormenta con granizo ligero", 99: "Tormenta con granizo intenso"
    };
    return descripciones[codigoClima] || "Condiciones variables";
}

// =============================================
// CARD DE CLIMA
// =============================================
function crearCardClima(nombreCiudad, datosClima) {
    const currentWeather = datosClima.weather?.current_weather || datosClima.current_weather;

    if (!currentWeather) {
        return `
            <div class="col-12 col-md-6 col-lg-4">
                <div class="card h-100 border-warning">
                    <div class="card-body text-center">
                        <h5>${escapeHtml(nombreCiudad)}</h5>
                        <p class="text-warning">❌ Datos no disponibles</p>
                    </div>
                </div>
            </div>
        `;
    }

    const temp = currentWeather.temperature;
    const viento = currentWeather.windspeed;
    const codigoClima = currentWeather.weathercode;
    const icono = obtenerIconoClima(codigoClima);
    const descripcion = obtenerDescripcionClima(codigoClima);

    return `
        <div class="col-12 col-md-6 col-lg-4">
            <div class="card h-100 shadow-sm">
                <div class="card-body text-center">
                    <h5 class="card-title">${escapeHtml(nombreCiudad)}</h5>
                    <div class="display-6">${icono}</div>
                    <h3 class="text-primary">${temp}°C</h3>
                    <p class="text-muted">${descripcion}</p>
                    <div class="row mt-3">
                        <div class="col-6">
                            <small>🌬️ Viento</small>
                            <p class="mb-0">${viento} km/h</p>
                        </div>
                        <div class="col-6">
                            <small>🧭 Dirección</small>
                            <p class="mb-0">${currentWeather.winddirection}°</p>
                        </div>
                    </div>
                    <small class="text-muted mt-2">${currentWeather.time}</small>
                </div>
            </div>
        </div>
    `;
}

// =============================================
// CARGAR CLIMA POR ZONA
// =============================================
async function cargarClima(zona) {
    const container = document.getElementById("clima-container");

    try {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="spinner-border text-info"></div>
                <p class="mt-2 text-muted">Cargando clima para zona ${zona}...</p>
            </div>
        `;

        let ciudades = zona === "todas"
            ? Object.values(ciudadesMendoza).flat()
            : ciudadesMendoza[zona] || [];

        if (ciudades.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <div class="alert alert-warning">
                        <h4>🌍 Zona no encontrada</h4>
                        <p>No hay ciudades registradas para la zona <strong>${zona}</strong>.</p>
                    </div>
                </div>
            `;
            return;
        }

        container.innerHTML = '';

        const promesasClima = ciudades.map(ciudad => {
            return fetch(`https://nimbus-mvp.onrender.com/api/meteo/coords?lat=${ciudad.lat}&lon=${ciudad.lng}`)
                .then(res => {
                    if (!res.ok) throw new Error(`HTTP ${res.status}`);
                    return res.json();
                })
                .then(data => ({ ciudad, data }))
                .catch(error => ({ ciudad, error }));
        });

        const resultados = await Promise.all(promesasClima);

        resultados.forEach(resultado => {
            if (resultado.error) {
                container.innerHTML += `
                    <div class="col-12 col-md-6 col-lg-4">
                        <div class="card h-100 border-danger">
                            <div class="card-body text-center text-danger">
                                <h5>${escapeHtml(resultado.ciudad.nombre)}</h5>
                                <p>❌ Error cargando datos</p>
                                <small>${resultado.error.message}</small>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                const currentWeather = resultado.data.weather?.current_weather || resultado.data.current_weather;
                if (currentWeather?.temperature !== undefined) {
                    container.innerHTML += crearCardClima(resultado.ciudad.nombre, resultado.data);
                }
            }
        });

        const tituloZona = zona === "todas"
            ? "Todas las Zonas"
            : `Zona ${zona.charAt(0).toUpperCase() + zona.slice(1)}`;

        document.getElementById('subtitulo-zona').textContent = `Clima en ${tituloZona}`;
        actualizarZonaActiva(zona);

    } catch (error) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="alert alert-danger">
                    <h4>❌ Error al cargar clima</h4>
                    <p>No se pudieron cargar los datos meteorológicos.</p>
                    <small>Error: ${escapeHtml(error.message)}</small>
                </div>
            </div>
        `;
    }
}

// =============================================
// CARGAR UBICACIÓN POR IP
// =============================================
async function cargarUbicacionIP() {
    const container = document.getElementById("ubicacion-container");

    try {
        const res = await fetch("https://nimbus-mvp.onrender.com/api/meteo/ip");
        if (!res.ok) throw new Error(`Error: ${res.status}`);

        const data = await res.json();
        const currentWeather = data.weather?.current_weather || data.current_weather;
        const ciudadNombre = data.city || "Tu ubicación";

        if (!currentWeather) throw new Error("No hay datos de clima");

        container.innerHTML = `
            <div class="card h-100 shadow-sm" style="max-height: 300px;">
                <div class="card-header bg-primary text-white py-2">
                    <h5 class="card-title mb-0 fs-6">📍 Mi Ubicación</h5>
                </div>
                <div class="card-body d-flex flex-column p-3">
                    <div class="text-center flex-grow-1 d-flex flex-column justify-content-center">
                        <div class="display-5 fw-bold text-primary mb-1">${currentWeather.temperature}°C</div>
                        <p class="mb-1 fw-semibold">${ciudadNombre}</p>
                        <p class="small text-muted mb-2">${obtenerDescripcionClima(currentWeather.weathercode)}</p>
                        <div class="d-flex justify-content-around small text-muted">
                            <div>
                                <div class="fw-bold">${currentWeather.windspeed} km/h</div>
                                <small>Viento</small>
                            </div>
                            <div>
                                <div class="fw-bold">${currentWeather.winddirection}°</div>
                                <small>Dirección</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

    } catch (error) {
        container.innerHTML = `
            <div class="card shadow-sm border-0 h-100" style="max-height: 300px;">
                <div class="card-header bg-primary text-white py-2">
                    <h5 class="card-title mb-0 fs-6">📍 Mi Ubicación</h5>
                </div>
                <div class="card-body d-flex flex-column p-3">
                    <div class="text-center flex-grow-1 d-flex align-items-center justify-content-center">
                        <div class="text-warning">
                            <p class="mb-1">No se pudo detectar ubicación</p>
                            <small class="text-muted">${error.message}</small>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

// =============================================
// MARCAR ZONA ACTIVA
// =============================================
function actualizarZonaActiva(zonaActiva) {
    document.querySelectorAll('nav a').forEach(enlace =>
        enlace.classList.remove('active', 'fw-bold')
    );

    const enlaceActivo = document.querySelector(`nav a[data-zona="${zonaActiva}"]`);
    if (enlaceActivo) {
        enlaceActivo.classList.add('active', 'fw-bold');
    }
}

// =============================================
// EVENTOS AL CARGAR PÁGINA
// =============================================
document.addEventListener("DOMContentLoaded", () => {
    cargarUbicacionIP();
    cargarClima('norte');

    document.querySelectorAll('nav a[data-zona]').forEach(enlace => {
        enlace.addEventListener('click', (event) => {
            event.preventDefault();
            cargarClima(enlace.getAttribute('data-zona'));
        });
    });
});
