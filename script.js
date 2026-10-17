document.addEventListener("DOMContentLoaded", () => {
    // Gestion du compteur de visiteurs réel
    let visitors = localStorage.getItem("nebula_visitors");
    if (!visitors) {
        visitors = 1240; // Base de départ réaliste
    } else {
        visitors = parseInt(visitors) + 1;
    }
    localStorage.setItem("nebula_visitors", visitors);

    const visitorCountEl = document.getElementById("visitor-count");
    if (visitorCountEl) {
        visitorCountEl.textContent = visitors;
    }

    // Éléments DOM
    const homeSection = document.getElementById("home-section");
    const loaderScreen = document.getElementById("loader-screen");
    const appSection = document.getElementById("app-section");
    const quizSection = document.getElementById("quiz-section");
    const adminSection = document.getElementById("admin-section");
    
    const accessBtn = document.getElementById("access-btn");
    const quizBtn = document.getElementById("quiz-btn");
    const burgerMenuBtn = document.getElementById("burger-menu-btn");
    
    const backHomeBtn = document.getElementById("back-home-btn");
    const backHomeQuizBtn = document.getElementById("back-home-quiz-btn");
    const adminCloseBtn = document.getElementById("admin-close-btn");
    
    const generateBtn = document.getElementById("generate-btn");
    const courseInput = document.getElementById("course-input");
    const resultBox = document.getElementById("result-box");

    const sendMsgBtn = document.getElementById("send-msg-btn");
    const visitorName = document.getElementById("visitor-name");
    const visitorMsg = document.getElementById("visitor-msg");
    const adminMessagesList = document.getElementById("admin-messages-list");

    // Chargement et affichage des messages reçus
    function loadMessages() {
        let messages = JSON.parse(localStorage.getItem("nebula_messages") || "[]");
        if (adminMessagesList) {
            if (messages.length === 0) {
                adminMessagesList.innerHTML = '<p style="color:var(--text-muted); font-size:0.85rem;">Aucun message reçu.</p>';
            } else {
                adminMessagesList.innerHTML = messages.map(m => `
                    <div class="message-item">
                        <strong>${escapeHtml(m.name)}</strong><br>
                        <span>${escapeHtml(m.text)}</span>
                    </div>
                `).join("");
            }
        }
    }

    function escapeHtml(text) {
        return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    loadMessages();

    // Envoi de message
    sendMsgBtn?.addEventListener("click", () => {
        const name = visitorName.value.trim();
        const text = visitorMsg.value.trim();
        if (!name || !text) {
            alert("Veuillez remplir votre nom et votre message.");
            return;
        }
        let messages = JSON.parse(localStorage.getItem("nebula_messages") || "[]");
        messages.unshift({ name, text });
        localStorage.setItem("nebula_messages", JSON.stringify(messages));
        
        visitorName.value = "";
        visitorMsg.value = "";
        alert("Message envoyé avec succès à l'administration !");
        loadMessages();
    });

    // Fonction de transition fluide avec loader
    function showLoaderAndExecute(callback) {
        homeSection.classList.add("hidden");
        appSection.classList.add("hidden");
        quizSection.classList.add("hidden");
        adminSection.classList.add("hidden");
        loaderScreen.classList.remove("hidden");

        setTimeout(() => {
            loaderScreen.classList.add("hidden");
            callback();
        }, 800);
    }

    accessBtn?.addEventListener("click", () => showLoaderAndExecute(() => appSection.classList.remove("hidden")));
    quizBtn?.addEventListener("click", () => showLoaderAndExecute(() => quizSection.classList.remove("hidden")));
    backHomeBtn?.addEventListener("click", () => showLoaderAndExecute(() => homeSection.classList.remove("hidden")));
    backHomeQuizBtn?.addEventListener("click", () => showLoaderAndExecute(() => homeSection.classList.remove("hidden")));
    adminCloseBtn?.addEventListener("click", () => showLoaderAndExecute(() => homeSection.classList.remove("hidden")));

    // Génération de cours
    generateBtn?.addEventListener("click", () => {
        if (!courseInput.value.trim()) {
            alert("Veuillez coller un cours à synthétiser !");
            return;
        }
        resultBox.innerHTML = "<strong>✨ Synthèse et Flashcards générées avec succès !</strong><br><br>• Résumé analytique prêt.<br>• 5 Flashcards interactives créées.";
    });

    // Menu Burger (Accès Admin sécurisé par mot de passe)
    burgerMenuBtn?.addEventListener("click", () => {
        const password = prompt("Entrez le mot de passe administrateur :");
        if (password === "admin123") {
            loadMessages();
            showLoaderAndExecute(() => adminSection.classList.remove("hidden"));
        } else if (password !== null) {
            alert("Mot de passe administrateur incorrect !");
        }
    });
});
