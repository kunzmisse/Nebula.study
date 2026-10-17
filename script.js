document.addEventListener("DOMContentLoaded", () => {
    const homeSection = document.getElementById("home-section");
    const loaderScreen = document.getElementById("loader-screen");
    const appSection = document.getElementById("app-section");
    const adminSection = document.getElementById("admin-section");
    
    const accessBtn = document.getElementById("access-btn");
    const adminOpenBtn = document.getElementById("admin-open-btn");
    const adminCloseBtn = document.getElementById("admin-close-btn");
    const backHomeBtn = document.getElementById("back-home-btn");
    const generateBtn = document.getElementById("generate-btn");
    const courseInput = document.getElementById("course-input");
    const resultBox = document.getElementById("result-box");

    function hideAll() {
        homeSection.classList.add("hidden");
        loaderScreen.classList.add("hidden");
        appSection.classList.add("hidden");
        adminSection.classList.add("hidden");
    }

    function showLoaderAndExecute(callback) {
        hideAll();
        loaderScreen.classList.remove("hidden");

        setTimeout(() => {
            loaderScreen.classList.add("hidden");
            callback();
        }, 1000);
    }

    // Clic pour accéder aux fonctionnalités de révision
    if (accessBtn) {
        accessBtn.addEventListener("click", () => {
            showLoaderAndExecute(() => {
                appSection.classList.remove("hidden");
            });
        });
    }

    // Bouton de retour accueil
    if (backHomeBtn) {
        backHomeBtn.addEventListener("click", () => {
            showLoaderAndExecute(() => {
                homeSection.classList.remove("hidden");
            });
        });
    }

    // Simulation de génération de cours
    if (generateBtn) {
        generateBtn.addEventListener("click", () => {
            if (!courseInput.value.trim()) {
                alert("Veuillez coller un cours d'abord !");
                return;
            }
            resultBox.innerHTML = "<strong>✨ Résumé généré avec succès !</strong><br>• 5 Flashcards créées.<br>• 3 Quiz prêts.";
        });
    }

    // Sécurité Administrateur avec mot de passe (admin123)
    if (adminOpenBtn) {
        adminOpenBtn.addEventListener("click", () => {
            const password = prompt("Entrez le mot de passe administrateur :");
            if (password === "admin123") {
                showLoaderAndExecute(() => {
                    adminSection.classList.remove("hidden");
                });
            } else if (password !== null) {
                alert("Mot de passe incorrect !");
            }
        });
    }

    // Fermer l'Admin
    if (adminCloseBtn) {
        adminCloseBtn.addEventListener("click", () => {
            showLoaderAndExecute(() => {
                homeSection.classList.remove("hidden");
            });
        });
    }
});

