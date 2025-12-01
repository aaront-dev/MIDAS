function midasAlert(mensaje, tipo = "success") {
    // Eliminar alertas previas si existen
    const existing = document.querySelectorAll(".midas-alert");
    existing.forEach(e => e.remove());

    // Crear contenedor
    const div = document.createElement("div");
    div.className = `midas-alert ${tipo}`;

    const icon =
        tipo === "success" ? "✔️" :
        tipo === "danger"  ? "❌" :
        tipo === "warning" ? "⚠️" :
        "ℹ️";

    div.innerHTML = `
        <span class="midas-icon">${icon}</span>
        <span class="midas-text">${mensaje}</span>
    `;

    document.body.appendChild(div);

    // Activar animación con pequeño delay
    setTimeout(() => div.classList.add("show"), 10);

    // Desaparecer después de 5 segundos
    setTimeout(() => {
        div.classList.remove("show");
        setTimeout(() => div.remove(), 300); // tiempo para animación CSS
    }, 5000);
}

