// Karanlık Mod (Dark Mode) Özelliği
document.addEventListener("DOMContentLoaded", function () {
    const darkModeToggle = document.createElement("button");
    darkModeToggle.innerText = "🌙 Dark Mode";
    darkModeToggle.style.position = "fixed";
    darkModeToggle.style.bottom = "10px";
    darkModeToggle.style.right = "10px";
    darkModeToggle.style.padding = "10px";
    darkModeToggle.style.cursor = "pointer";
    document.body.appendChild(darkModeToggle);

    darkModeToggle.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");
        if (document.body.classList.contains("dark-mode")) {
            darkModeToggle.innerText = "☀️ Light Mode";
        } else {
            darkModeToggle.innerText = "🌙 Dark Mode";
        }
    });
});

// CSS ile Dark Mode Stili
const darkModeStyle = document.createElement("style");
darkModeStyle.innerHTML = `
    .dark-mode {
        background: #121212;
        color: white;
    }
    .dark-mode header, .dark-mode footer {
        background: #1e1e1e;
    }
`;
document.head.appendChild(darkModeStyle);
