document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".login-container");
    if (!container) return; // Evita errores si no existe en el DOM

    container.style.opacity = 0;
    container.style.transform = "translateY(10px)";
    container.style.transition = "opacity 0.9s ease, transform 0.9s ease";

    setTimeout(() => {
        container.style.opacity = 1;
        container.style.transform = "translateY(0)";
    }, 100);
});
