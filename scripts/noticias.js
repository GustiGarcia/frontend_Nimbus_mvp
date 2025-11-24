// =============================================
// CONFIG: SELECCIÓN AUTOMÁTICA DE API BASE URL
// =============================================
const API_BASE =
  window.location.hostname.includes("render") ||
  window.location.hostname.includes("onrender") ||
  window.location.hostname.includes("vercel.app")
    ? "https://nimbus-mvp.onrender.com"
    : "http://localhost:5000";

// =============================================
// FUNCIÓN HELPER: PREVENIR INYECCIÓN HTML
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
// FUNCIÓN PRINCIPAL: CARGAR NOTICIAS
// =============================================
async function cargarNoticias(categoria = "general") {
  const noticiasContainer = document.getElementById("noticias-container");

  try {
    noticiasContainer.innerHTML = `
      <div class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-2 text-muted">Cargando noticias de ${categoria}...</p>
      </div>
    `;

    // 👉 URL dinámico para Render / Localhost / Vercel
    const res = await fetch(`${API_BASE}/api/noticias/${categoria}`);

    if (!res.ok) throw new Error(`Error API: ${res.status}`);

    const data = await res.json();

    noticiasContainer.innerHTML = "";

    // --- Si falta la API KEY ---
    if (data.error === "API_KEY_MISSING") {
      noticiasContainer.innerHTML = `
        <div class="alert alert-danger text-center py-5">
          <h4>❌ Falta la API KEY de NewsAPI</h4>
          <p>Configúrala en Render como variable <strong>NEWS_API_KEY</strong>.</p>
        </div>
      `;
      return;
    }

    // --- Si no hay noticias ---
    if (!data.noticias || data.noticias.length === 0) {
      noticiasContainer.innerHTML = `
        <div class="text-center py-5">
          <div class="alert alert-info">
            <h4>📰 No hay noticias</h4>
            <p>No se encontraron noticias para <strong>${categoria}</strong>.</p>
          </div>
        </div>
      `;
      return;
    }

    // --- Renderizar noticias ---
    data.noticias.forEach((noticia) => {
      const col = document.createElement("div");
      col.className = "col-12 col-md-6 col-lg-4 mb-4";

      col.innerHTML = `
        <div class="card h-100 shadow-sm hover-shadow">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title text-primary">${escapeHtml(noticia.titulo)}</h5>
            <p class="card-text flex-grow-1 text-muted">
              ${escapeHtml(noticia.descripcion)}
            </p>
            <div class="d-flex justify-content-between align-items-center mt-auto">
              <small class="text-muted">
                <strong>${escapeHtml(noticia.fuente)}</strong><br>
                ${escapeHtml(noticia.fecha)}
              </small>
              <a href="${noticia.url}" target="_blank" class="btn btn-sm btn-outline-primary">
                Leer más
              </a>
            </div>
          </div>
        </div>
      `;

      noticiasContainer.appendChild(col);
    });

    // Actualizar título principal
    document.getElementById("titulo-principal").textContent =
      `Noticias ${categoria.charAt(0).toUpperCase() + categoria.slice(1)}`;

    actualizarCategoriaActiva(categoria);

  } catch (error) {
    console.error("Error detallado:", error);
    noticiasContainer.innerHTML = `
      <div class="alert alert-danger text-center py-5">
        <h4>❌ Error al cargar noticias</h4>
        <p>No se pudieron cargar las noticias.</p>
        <small>${error.message}</small>
      </div>
    `;
  }
}

// =============================================
// NAVBAR: CATEGORÍA ACTIVA
// =============================================
function actualizarCategoriaActiva(categoriaActiva) {
  const enlaces = document.querySelectorAll("nav a");

  enlaces.forEach((e) => e.classList.remove("active", "fw-bold"));

  const activo = document.querySelector(`nav a[data-cat="${categoriaActiva}"]`);

  if (activo) activo.classList.add("active", "fw-bold");
}

// =============================================
// EVENTOS PRINCIPALES
// =============================================
document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 Noticias listas. Servidor:", API_BASE);

  cargarNoticias("general");

  document.querySelectorAll("nav a").forEach((enlace) => {
    enlace.addEventListener("click", (event) => {
      if (enlace.hasAttribute("data-cat")) {
        event.preventDefault();
        cargarNoticias(enlace.getAttribute("data-cat"));
      }
    });
  });
});
