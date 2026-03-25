import { getQuote, getPrompts, getSong } from "./api.js";
import { loadLibrary } from "./library.js";
import { loadJournal, saveJournalEntry } from "./journal.js";
import { analyzeMood } from "./mood.js"

document.addEventListener("DOMContentLoaded", () => {
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
    const views = document.querySelectorAll(".view");

    function showView(view) {
        views.forEach(v => v.classList.add("hidden"));

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

        if (!text) {
            userInput.style.outline = "2px solid red";
            return;
        }

        supportBtn.disabled = true;
        supportBtn.classList.add("loading");
        supportBtn.innerText = "Finding inspiration...";

        try {
            const mood = analyzeMood(text);

            const [quote, prompt, song] = await Promise.all([
                getQuote(),
                getPrompts(),
                getSong(mood)
            ]);

            showView("results");

            document.getElementById("result-quote")?.innerText = quote;
            document.getElementById("journal-prompt")?.innerText = prompt;
            document.getElementById("song-title")?.innerText = song.title;
            document.getElementById("song-artist")?.innerText = song.artist;

            const art = document.getElementById("album-art");
            if (art) art.src = song.artwork;

            const preview = document.getElementById("song-preview");
            if (preview) {
                preview.src = song.previewUrl || "";
                preview.style.display = song.previewUrl ? "block" : "none";
            }

            userInput.value = "";

        } catch (error) {
            console.error(error);
            alert("Something went wrong.");
        } finally {
            supportBtn.disabled = false;
            supportBtn.classList.remove("loading");
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

        document.getElementById("journal-entry").value = "";
    });
});
