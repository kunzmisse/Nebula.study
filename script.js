document.addEventListener("DOMContentLoaded", () => {
    const homeSection = document.getElementById("home-section");
    const loaderScreen = document.getElementById("loader-screen");
    const adminSection = document.getElementById("admin-section");
    
    const accessBtn = document.getElementById("access-btn");
    const adminOpenBtn = document.getElementById("admin-open-btn");
    const adminCloseBtn = document.getElementById("admin-close-btn");

    function showLoaderAndExecute(callback) {
        homeSection.classList.add("hidden");
        adminSection.classList.add("hidden");
        loaderScreen.classList.remove("hidden");

        setTimeout(() => {
            loaderScreen.classList.add("hidden");
            callback();
        }, 1200);
    }

    if (accessBtn) {
        accessBtn.addEventListener("click", () => {
            showLoaderAndExecute(() => {
                alert("Redirection vers les outils de révision et flashcards !");
                homeSection.classList.remove("hidden");
            });
        });
    }

    if (adminOpenBtn) {
        adminOpenBtn.addEventListener("click", () => {
            showLoaderAndExecute(() => {
                adminSection.classList.remove("hidden");
            });
        });
    }

    if (adminCloseBtn) {
        adminCloseBtn.addEventListener("click", () => {
            showLoaderAndExecute(() => {
                homeSection.classList.remove("hidden");
            });
        });
    }
});

