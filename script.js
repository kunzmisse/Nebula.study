document.addEventListener("DOMContentLoaded", () => {
    const homeSection = document.getElementById("home-section");
    const loaderScreen = document.getElementById("loader-screen");
    const appSection = document.getElementById("app-section");
    const quizSection = document.getElementById("quiz-section");
    const adminSection = document.getElementById("admin-section");
    
    const accessBtn = document.getElementById("access-btn");
    const quizBtn = document.getElementById("quiz-btn");
    const adminOpenBtn = document.getElementById("admin-open-btn");
    
    const backHomeBtn = document.getElementById("back-home-btn");
    const backHomeQuizBtn = document.getElementById("back-home-quiz-btn");
    const adminCloseBtn = document.getElementById("admin-close-btn");
    
    const generateBtn = document.getElementById("generate-btn");
    const courseInput = document.getElementById("course-input");
    const resultBox = document.getElementById("result-box");

    function showLoaderAndExecute(callback) {
        homeSection.classList.add("hidden");
        appSection.classList.add("hidden");
        quizSection.classList.add("hidden");
        adminSection.classList.add("hidden");
        loaderScreen.classList.remove("hidden");

        setTimeout(() => {
            loaderScreen.classList.add("hidden");
            callback();
        }, 900);
    }

    accessBtn?.addEventListener("click", () => showLoaderAndExecute(() => appSection.classList.remove("hidden")));
    quizBtn?.addEventListener("click", () => showLoaderAndExecute(() => quizSection.classList.remove("hidden")));
    backHomeBtn?.addEventListener("click", () => showLoaderAndExecute(() => homeSection.classList.remove("hidden")));
    backHomeQuizBtn?.addEventListener("click", () => showLoaderAndExecute(() => homeSection.classList.remove("hidden")));
    adminCloseBtn?.addEventListener("click", () => showLoaderAndExecute(() => homeSection.classList.remove("hidden")));

    generateBtn?.addEventListener("click", () => {
        if (!courseInput.value.trim()) {
            alert("Veuillez coller un cours d'abord !");
            return;
        }
        resultBox.innerHTML = "<strong>✨ Analyse terminée avec succès !</strong><br><br>• Résumé : Document structuré.<br>• Flashcards : 5 cartes prêtes.";
    });

    adminOpenBtn?.addEventListener("click", () => {
        const password = prompt("Mot de passe administrateur :");
        if (password === "admin123") {
            showLoaderAndExecute(() => adminSection.classList.remove("hidden"));
        } else if (password !== null) {
            alert("Mot de passe incorrect !");
        }
    });
});
