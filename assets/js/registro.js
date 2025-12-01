document.addEventListener("DOMContentLoaded", () => {

    /* ================================
       1. ANIMACIÓN DEL CONTENEDOR
    ================================= */
    const container = document.querySelector(".register-container");
    if (container) {
        container.style.opacity = 0;
        container.style.transform = "translateY(10px)";
        container.style.transition = "opacity 1s ease, transform 1s ease";

        setTimeout(() => {
            container.style.opacity = 1;
            container.style.transform = "translateY(0)";
        }, 100);
    }


    /* ================================
       2. VALIDACIÓN DE CONTRASEÑAS
    ================================= */
    const form = document.querySelector("form");
    if (!form) return; // Evita errores si se carga en SPA accidentalmente

    const passInput = form.password;
    const confirmInput = form.confirmar;

    if (!passInput || !confirmInput) return;


    /* --- Caja de mensaje dinámica --- */
    const msgBox = document.createElement("div");
    msgBox.style.display = "none";
    msgBox.style.marginTop = "8px";
    msgBox.style.padding = "13px";
    msgBox.style.borderRadius = "6px";
    msgBox.style.fontWeight = "bold";
    msgBox.style.fontSize = "14px";
    msgBox.style.opacity = "0";
    msgBox.style.transform = "translateY(-8px)";
    msgBox.style.transition = "0.25s ease";

    confirmInput.insertAdjacentElement("afterend", msgBox);


    /* ================================
       Funciones
    ================================= */
    function showMessage(text, color) {
        msgBox.textContent = text;

        if (color === "red") {
            msgBox.style.background = "#ffd5d5";
            msgBox.style.color = "#b30000";
            msgBox.style.border = "1px solid #b30000";
        } else {
            msgBox.style.background = "#d5ffe0";
            msgBox.style.color = "#006622";
            msgBox.style.border = "1px solid #009933";
        }

        msgBox.style.display = "block";

        requestAnimationFrame(() => {
            msgBox.style.opacity = "1";
            msgBox.style.transform = "translateY(0)";
        });
    }

    function hideMessage() {
        msgBox.style.opacity = "0";
        msgBox.style.transform = "translateY(-8px)";

        setTimeout(() => {
            msgBox.style.display = "none";
        }, 250);
    }

    function validarCoincidencia() {
        const pass = passInput.value.trim();
        const confirm = confirmInput.value.trim();

        if (confirm === "") {
            hideMessage();
            passInput.style.borderColor = "";
            confirmInput.style.borderColor = "";
            return true;
        }

        if (pass !== confirm) {
            showMessage("⚠ Las contraseñas no coinciden", "red");
            passInput.style.borderColor = "red";
            confirmInput.style.borderColor = "red";
            return false;
        }

        showMessage("✔ Las contraseñas coinciden", "green");
        passInput.style.borderColor = "green";
        confirmInput.style.borderColor = "green";

        return true;
    }


    /* ================================
       Eventos
    ================================= */
    passInput.addEventListener("input", validarCoincidencia);
    confirmInput.addEventListener("input", validarCoincidencia);

    form.addEventListener("submit", (e) => {
        if (!validarCoincidencia()) e.preventDefault();
    });

});

