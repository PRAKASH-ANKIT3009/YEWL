(() => {
    if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
            navigator.serviceWorker.register("/service-worker.js").catch(error => {
                console.error("NOORSLOT offline support could not start:", error);
            });
        });
    }

    let installPrompt = null;
    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.navigator.standalone;
    const alreadyInstalled = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;
    if (alreadyInstalled) return;

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Install NOORSLOT";
    button.setAttribute("aria-label", "Install NOORSLOT app");
    Object.assign(button.style, {
        position: "fixed",
        right: "18px",
        bottom: "18px",
        zIndex: "9999",
        minHeight: "46px",
        padding: "0 20px",
        border: "0",
        borderRadius: "999px",
        background: "#b92767",
        color: "#fff",
        boxShadow: "0 8px 24px rgba(20, 15, 20, .24)",
        font: "700 14px Arial, sans-serif",
        cursor: "pointer",
        display: "none"
    });
    document.addEventListener("DOMContentLoaded", () => document.body.appendChild(button), { once: true });

    window.addEventListener("beforeinstallprompt", event => {
        event.preventDefault();
        installPrompt = event;
        button.style.display = "block";
    });

    window.addEventListener("appinstalled", () => {
        installPrompt = null;
        button.style.display = "none";
    });

    if (isIos) {
        document.addEventListener("DOMContentLoaded", () => { button.style.display = "block"; }, { once: true });
    }

    button.addEventListener("click", async () => {
        if (installPrompt) {
            installPrompt.prompt();
            await installPrompt.userChoice;
            installPrompt = null;
            button.style.display = "none";
        } else if (isIos) {
            alert("Safari mein Share button dabayein, phir 'Add to Home Screen' chunein.");
        } else {
            alert("Browser menu kholkar 'Install app' ya 'Add to Home Screen' chunein.");
        }
    });
})();
