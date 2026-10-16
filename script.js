// Navigation entre les pages
const homeSection = document.getElementById('homeSection');
const appSection = document.getElementById('appSection');
const contactSection = document.getElementById('contactSection');
const adminPanel = document.getElementById('adminPanel');

const navHomeBtn = document.getElementById('navHomeBtn');
const navAppBtn = document.getElementById('navAppBtn');
const navContactBtn = document.getElementById('navContactBtn');
const getStartedBtn = document.getElementById('getStartedBtn');

function showPage(page) {
    homeSection.classList.add('hidden');
    appSection.classList.add('hidden');
    contactSection.classList.add('hidden');
    adminPanel.classList.add('hidden');

    navHomeBtn.classList.remove('active');
    navAppBtn.classList.remove('active');
    navContactBtn.classList.remove('active');

    if (page === 'home') {
        homeSection.classList.remove('hidden');
        navHomeBtn.classList.add('active');
    } else if (page === 'app') {
        appSection.classList.remove('hidden');
        navAppBtn.classList.add('active');
    } else if (page === 'contact') {
        contactSection.classList.remove('hidden');
        navContactBtn.classList.add('active');
    }
}

navHomeBtn.addEventListener('click', () => showPage('home'));
navAppBtn.addEventListener('click', () => showPage('app'));
navContactBtn.addEventListener('click', () => showPage('contact'));
getStartedBtn.addEventListener('click', () => showPage('app'));

// Vérification de bannissement
if (localStorage.getItem("nebula_banned") === "true") {
    document.body.innerHTML = `
        <div style="display:flex; justify-content:center; align-items:center; height:100vh; flex-direction:column; text-align:center; color:#f3e8ff; background:#030014;">
            <h1 style="color:#ef4444; margin-bottom:1rem;">⛔ Accès Interdit</h1>
            <p>Votre accès à NebulaStudy AI a été restreint par l'administrateur.</p>
        </div>
    `;
}

// Gestion des visiteurs
let visits = parseInt(localStorage.getItem("nebula_visits") || "1");
if (!sessionStorage.getItem("visited_session")) {
    visits++;
    localStorage.setItem("nebula_visits", visits);
    sessionStorage.setItem("visited_session", "true");
}
document.getElementById('visitorCount').textContent = visits;

// Gestion du formulaire de contact (envoi vers la page admin)
const contactForm = document.getElementById('contactForm');
const contactSuccess = document.getElementById('contactSuccess');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contactName').value;
    const message = document.getElementById('contactMessage').value;

    let messages = JSON.parse(localStorage.getItem("nebula_messages") || "[]");
    messages.push({ id: Date.now(), name: name, text: message, date: new Date().toLocaleDateString() });
    localStorage.setItem("nebula_messages", JSON.stringify(messages));

    contactForm.reset();
    contactSuccess.classList.remove('hidden');
    setTimeout(() => contactSuccess.classList.add('hidden'), 4000);
});

// Connexion Admin
const adminLoginBtn = document.getElementById('adminLoginBtn');
const adminModal = document.getElementById('adminModal');
const submitAdminLogin = document.getElementById('submitAdminLogin');
const cancelAdminLogin = document.getElementById('cancelAdminLogin');
const adminPasswordInput = document.getElementById('adminPasswordInput');
const closeAdminBtn = document.getElementById('closeAdminBtn');
const msgCountElem = document.getElementById('msgCount');
const adminMessagesList = document.getElementById('adminMessagesList');
const userListContainer = document.getElementById('userListContainer');

const ADMIN_PASSWORD = "prof-super-admin";

let mockUsers = JSON.parse(localStorage.getItem("nebula_users") || JSON.stringify([
    { id: 1, name: "Étudiant_Anonyme_1" },
    { id: 2, name: "Utilisateur_Test_92" }
]));

adminLoginBtn.addEventListener('click', () => {
    adminModal.classList.remove('hidden');
    adminPasswordInput.value = '';
    adminPasswordInput.focus();
});

cancelAdminLogin.addEventListener('click', () => adminModal.classList.add('hidden'));

submitAdminLogin.addEventListener('click', () => {
    if (adminPasswordInput.value === ADMIN_PASSWORD) {
        adminModal.classList.add('hidden');
        homeSection.classList.add('hidden');
        appSection.classList.add('hidden');
        contactSection.classList.add('hidden');
        adminPanel.classList.remove('hidden');
        loadAdminData();
    } else {
        alert("Mot de passe administrateur incorrect !");
    }
});

closeAdminBtn.addEventListener('click', () => {
    adminPanel.classList.add('hidden');
    showPage('home');
});

function loadAdminData() {
    let messages = JSON.parse(localStorage.getItem("nebula_messages") || "[]");
    msgCountElem.textContent = messages.length;

    if (messages.length === 0) {
        adminMessagesList.innerHTML = `<p style="color:#94a3b8; font-size:0.9rem;">Aucun message pour le moment.</p>`;
    } else {
        adminMessagesList.innerHTML = '';
        messages.forEach((msg, idx) => {
            const div = document.createElement('div');
            div.className = 'msg-item';
            div.innerHTML = `<div><strong>${msg.name}</strong> : ${msg.text}</div> <button class="btn-ban" onclick="deleteMsg(${msg.id})">Supprimer</button>`;
            adminMessagesList.appendChild(div);
        });
    }

    userListContainer.innerHTML = '';
    mockUsers.forEach(user => {
        const div = document.createElement('div');
        div.className = 'user-item';
        div.innerHTML = `<span>👤 ${user.name}</span> <button class="btn-ban" onclick="banUser(${user.id})">Bannir</button>`;
        userListContainer.appendChild(div);
    });
}

window.deleteMsg = function(msgId) {
    let messages = JSON.parse(localStorage.getItem("nebula_messages") || "[]");
    messages = messages.filter(m => m.id !== msgId);
    localStorage.setItem("nebula_messages", JSON.stringify(messages));
    loadAdminData();
};

window.banUser = function(userId) {
    mockUsers = mockUsers.filter(u => u.id !== userId);
    localStorage.setItem("nebula_users", JSON.stringify(mockUsers));
    loadAdminData();
    alert("Utilisateur banni !");
};

// Logique IA du site (Synthèse, Flashcards, Quiz)
const generateBtn = document.getElementById('generateBtn');
const courseInput = document.getElementById('courseInput');
const resultsSection = document.getElementById('resultsSection');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.target).classList.add('active');
    });
});

let currentFlashcards = [];
let currentQuiz = [];
let currentCardIndex = 0;
let currentQuizIndex = 0;
let score = 0;

generateBtn.addEventListener('click', () => {
    const text = courseInput.value.trim();
    if (text.length < 20) {
        alert("Veuillez entrer un texte de cours plus long (au moins 20 caractères).");
        return;
    }

    const sentences = text.split(/[\.\!\?]+/).filter(s => s.trim().length > 5);

    // Résumé
    const summaryList = document.getElementById('summaryList');
    summaryList.innerHTML = '';
    const summaryCount = Math.min(4, sentences.length);
    for (let i = 0; i < summaryCount; i++) {
        const li = document.createElement('li');
        li.textContent = sentences[i].trim() + ".";
        summaryList.appendChild(li);
    }

    // Flashcards
    currentFlashcards = sentences.map((sent, index) => {
        const words = sent.trim().split(' ');
        const front = words.length > 4 ? words.slice(0, 4).join(' ') + "..." : sent;
        return { front: `Notion ${index + 1} : ${front}`, back: sent.trim() + "." };
    });
    currentCardIndex = 0;
    updateFlashcard();

    // Quiz
    currentQuiz = sentences.slice(0, 3).map((sent) => {
        return {
            question: `Que peut-on retenir de ce passage : "${sent.trim().substring(0, 30)}..." ?`,
            options: [
                sent.trim() + ".",
                "Cette affirmation est inexacte dans le contexte.",
                "C'est un élément sans rapport avec le cours."
            ].sort(() => Math.random() - 0.5),
            correct: sent.trim() + "."
        };
    });
    currentQuizIndex = 0;
    score = 0;
    loadQuizQuestion();

    resultsSection.classList.remove('hidden');
    resultsSection.scrollIntoView({ behavior: 'smooth' });
});

// Flashcards interactivité
const flashcard = document.getElementById('flashcardContainer');
const fcFront = document.getElementById('fcFront');
const fcBack = document.getElementById('fcBack');
const cardCounter = document.getElementById('cardCounter');

flashcard.addEventListener('click', () => flashcard.classList.toggle('flipped'));

document.getElementById('nextCard').addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentCardIndex < currentFlashcards.length - 1) {
        currentCardIndex++;
        flashcard.classList.remove('flipped');
        updateFlashcard();
    }
});

document.getElementById('prevCard').addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentCardIndex > 0) {
        currentCardIndex--;
        flashcard.classList.remove('flipped');
        updateFlashcard();
    }
});

function updateFlashcard() {
    if (currentFlashcards.length > 0) {
        fcFront.textContent = currentFlashcards[currentCardIndex].front;
        fcBack.textContent = currentFlashcards[currentCardIndex].back;
        cardCounter.textContent = `${currentCardIndex + 1} / ${currentFlashcards.length}`;
    }
}

// Quiz interactivité
const quizQuestion = document.getElementById('quizQuestion');
const quizOptions = document.getElementById('quizOptions');
const nextQuizBtn = document.getElementById('nextQuizBtn');
const quizScore = document.getElementById('quizScore');

function loadQuizQuestion() {
    if (currentQuizIndex < currentQuiz.length) {
        const q = currentQuiz[currentQuizIndex];
        quizQuestion.textContent = `Question ${currentQuizIndex + 1} : ${q.question}`;
        quizOptions.innerHTML = '';
        nextQuizBtn.classList.add('hidden');

        q.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.textContent = opt;
            btn.className = 'option-btn';
            btn.addEventListener('click', () => checkAnswer(btn, opt, q.correct));
            quizOptions.appendChild(btn);
        });
    } else {
        quizQuestion.textContent = "🎉 Évaluation terminée avec succès !";
        quizOptions.innerHTML = '';
        nextQuizBtn.classList.add('hidden');
        quizScore.textContent = `Score obtenu : ${score} / ${currentQuiz.length}`;
        quizScore.classList.remove('hidden');
    }
}

function checkAnswer(selectedBtn, selectedOpt, correctOpt) {
    const allBtns = quizOptions.querySelectorAll('.option-btn');
    allBtns.forEach(b => {
        b.style.pointerEvents = 'none';
        if (b.textContent === correctOpt) {
            b.classList.add('correct');
        } else if (b === selectedBtn) {
            b.classList.add('incorrect');
        }
    });

    if (selectedOpt === correctOpt) score++;
    nextQuizBtn.classList.remove('hidden');
}

nextQuizBtn.addEventListener('click', () => {
    currentQuizIndex++;
    loadQuizQuestion();
});
