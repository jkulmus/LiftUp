import { getQuote, getPrompts, getSong } from "./api.js";
import { loadLibrary, saveToLibrary, showToast } from "./library.js";
import { loadJournal, saveJournalEntry } from "./journal.js";
import { analyzeMood } from "./mood.js";

document.addEventListener("DOMContentLoaded", () => {

    // ELEMENT CACHE
    const supportBtn = document.getElementById("get-support-btn");
    const userInput = document.getElementById("user-input");
    const themeToggle = document.getElementById("theme-toggle");
    const resultQuote = document.getElementById("result-quote");
    const journalPrompt = document.getElementById("journal-prompt");
    const songTitle = document.getElementById("song-title");
    const songArtist = document.getElementById("song-artist");
    const albumArt = document.getElementById("album-art");
    const songPreview = document.getElementById("song-preview");

    let currentMood = "Inspirational";

    // THEME
    if (localStorage.getItem("theme") === "dark") document.body.classList.add("dark");

    themeToggle?.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
    });

    // NAVIGATION
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

    // UPDATE RESULTS
    function updateResults(quote, prompt, song) {
        if (resultQuote) resultQuote.textContent = quote;
        if (journalPrompt) journalPrompt.textContent = prompt;
        if (songTitle) songTitle.textContent = song.title;
        if (songArtist) songArtist.textContent = song.artist;
        if (albumArt) albumArt.src = song.artwork;
        if (songPreview) {
            songPreview.src = song.previewUrl || "";
            songPreview.style.display = song.previewUrl ? "block" : "none";
        }
    }

    // SUPPORT FLOW
    supportBtn?.addEventListener("click", async () => {
        const text = userInput.value.trim();
        if (!text) {
            userInput.classList.add("error");
            return;
        }
        userInput.classList.remove("error");
        supportBtn.disabled = true;
        supportBtn.innerText = "Finding inspiration...";

        try {
            currentMood = analyzeMood(text);
            const [quote, prompt, song] = await Promise.all([
                getQuote(),
                getPrompts(),
                getSong(currentMood)
            ]);
            updateResults(quote, prompt, song);
            showView("results");
            userInput.value = "";
        } catch (error) {
            console.error(error);
            showToast("API Error. Try again.");
        } finally {
            supportBtn.disabled = false;
            supportBtn.innerText = "Show me something uplifting";
        }
    });

    // SAVE BUTTONS
    document.getElementById("save-quote-btn").addEventListener("click", () => {
        saveToLibrary("quotes", resultQuote.textContent.trim());
    });

    document.getElementById("save-song-btn").addEventListener("click", () => {
        saveToLibrary("songs", { title: songTitle.textContent.trim(), artist: songArtist.textContent.trim() });
    });

    document.getElementById("save-prompt-btn").addEventListener("click", () => {
        saveToLibrary("prompts", journalPrompt.textContent.trim());
    });

    // JOURNAL
    document.getElementById("save-journal-btn").addEventListener("click", () => {
        const mood = document.getElementById("journal-mood").value;
        const text = document.getElementById("journal-entry").value.trim();
        if (!mood || !text) {
            showToast("Fill in all fields");
            return;
        }
        saveJournalEntry(mood, text);
        loadJournal();
        document.getElementById("journal-entry").value = "";
    });

    //RESET DATA

    document.getElementById("reset-data-btn").addEventListener("click", () => {
        if (!confirm("Are you sure? This cannot be undone.")) return;

        ["quotes", "songs", "prompts", "journal"].forEach(key => {
            localStorage.removeItem(key);
        });

        loadLibrary();
        loadJournal();
        showToast("All data has been wiped.");
    });
});