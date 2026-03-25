import { getQuote, getPrompts, getSong } from "./api.js";
import { loadLibrary } from "./library.js";
import { loadJournal, saveJournalEntry } from "./journal.js";
import { analyzeMood } from "./mood.js"

// Elements
const supportBtn = document.getElementById("get-support-btn");
const userInput = document.getElementById("user-input");
const themeToggle = document.getElementById("theme-toggle");

// Theme
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
}

themeToggle?.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("theme",
        document.body.classList.contains("dark") ? "dark" : "light"
    );
});

// Navigation
function showView(view) {
    document.querySelectorAll(".view").forEach(v => v.classList.add("hidden"));
    const target = document.getElementById(`${view}-view`);
    if (target) target.classList.remove("hidden");

    document.querySelectorAll(".footer-nav button").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.view === view);
    });

    if (view === "library") loadLibrary();
    if (view === "journal") loadJournal();
}

document.querySelectorAll("[data-view]").forEach(btn => {
    btn.addEventListener("click", () => showView(btn.dataset.view));
});

document.querySelectorAll(".back-btn").forEach(btn => {
    btn.addEventListener("click", () => showView("home"));
});

// Support Flow
supportBtn?.addEventListener("click", async () => {
    const text = userInput.value.trim();
    if (!text) return alert("Please enter how you're feeling.");

    supportBtn.disabled = true;
    supportBtn.innerText = "Finding inspiration...";

    try {
        const mood = analyzeMood(text);

        const [quote, prompt, song] = await Promise.all([
            getQuote(),
            getPrompts(),
            getSong(mood)
        ]);

        showView("results");

        document.getElementById("result-quote").innerText = quote;
        document.getElementById("journal-prompt").innerText = prompt;
        document.getElementById("song-title").innerText = song.title;
        document.getElementById("song-artist").innerText = song.artist;
        document.getElementById("album-art").src = song.artwork;

        const preview = document.getElementById("song-preview");
        preview.src = song.previewUrl || "";
        preview.style.display = song.previewUrl ? "block" : "none";

    } catch {
        alert("Something went wrong.");
    } finally {
        supportBtn.disabled = false;
        supportBtn.innerText = "Show me something uplifting";
    }
});

// Journal Save
document.getElementById("save-journal-btn")?.addEventListener("click", () => {
    const mood = document.getElementById("journal-mood").value;
    const text = document.getElementById("journal-entry").value.trim();

    if (!mood || !text) return;

    saveJournalEntry(mood, text);
    loadJournal();
});