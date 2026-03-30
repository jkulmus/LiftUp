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

    const saveQuoteBtn = document.getElementById("save-quote-btn");
    const saveSongBtn = document. getElementById("save-song-btn");
    const savePromptBtn = document.getElementById("save-prompt-btn");
    const saveJournalBtn = document.getElementById("save-journal-btn");
    const resetDataBtn = document.getElementById("reset-data-btn");

    const journalMood = document.getElementById("journal-mood");
    const journalEntry = document.getElementById("journal-entry");

    const views = document.querySelectorAll(".view");
    const navButtons = document.querySelectorAll(".footer-nav button");
    const backButtons = document.querySelectorAll(".back-btn");

    // THEME
    if (localStorage.getItem("theme") === "dark") {
            document.body.classList.add("dark");
    }

    themeToggle?.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        localStorage.setItem(
            "theme", 
            document.body.classList.contains("dark") ? "dark" : "light"
        );
    });

    // NAVIGATION
    function showView(view) {
        views.forEach(v => v.classList.add("hidden"));

        const target = document.getElementById(`${view}-view`);
        if (target) {
            target.classList.remove("hidden");
        }

        navButtons.forEach(btn => {
            btn.classList.toggle("active", btn.dataset.view === view);
        });

        if (view === "library") loadLibrary();
        if (view === "journal") loadJournal();
    }

    navButtons.forEach(btn => {
        btn.addEventListener("click", () => showView(btn.dataset.view));
    });

    backButtons.forEach(btn => {
        btn.addEventListener("click", () => showView("home"));
    });

    // UPDATE RESULTS
    function updateResults(quote, prompt, song) {
        if (resultQuote) resultQuote.textContent = quote;
        if (journalPrompt) journalPrompt.textContent = prompt;
        if (songTitle) songTitle.textContent = song.title;
        if (songArtist) songArtist.textContent = song.artist;

        if (albumArt) {
            albumArt.src = song.artwork;
            albumArt.alt = `Album artwork for ${song.title} by ${song.artist}`;
        }

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
            showToast("Please tell me how you're feeling first.");
            return;
        }

        userInput.classList.remove("error");
        supportBtn.disabled = true;
        supportBtn.textContent = "Finding inspiration...";

        try {
            const mood = analyzeMood(text);

            const [quote, prompt, song] = await Promise.all([
                getQuote(),
                getPrompts(),
                getSong(mood)
            ]);

            updateResults(quote, prompt, song);
            showView("results");
            userInput.value = "";
        } catch (error) {
            console.error("Support flow failed:", error);
            showToast("API Error. Try again.");
        } finally {
            supportBtn.disabled = false;
            supportBtn.textContent = "Show me something uplifting";
        }
    });

    // SAVE BUTTONS
    saveQuoteBtn?.addEventListener("click", () => {
        const text = resultQuote?.textContent.trim();
        if (text) {
            saveToLibrary("quotes", text);
        }
    });

    saveSongBtn?.addEventListener("click", () => {
        const title = songTitle?.textContent.trim();
        const artist = songArtist.textContent.trim();

        if (title && artist) {
            saveToLibrary("songs", { title, artist });
        }
    });

    savePromptBtn?.addEventListener("click", () => {
        const text = journalPrompt?.textContent.trim();
        if (text) {
            saveToLibrary("prompts", text);
        }
    });

    // JOURNAL
    saveJournalBtn?.addEventListener("click", () => {
        const mood = journalMood?.value;
        const text = journalEntry?.value.trim();

        if (!mood || !text) {
            showToast("Fill in all fields");
            return;
        }

        saveJournalEntry(mood, text);
        loadJournal();

        journalMood.value = "";
        journalEntry.value = "";
    });

    //RESET DATA

    resetDataBtn?.addEventListener("click", () => {
        const confirmed = confirm("Are you sure? This cannot be undone");
        if (!confirmed) return;

        ["quotes", "songs", "prompts", "journal"].forEach(key => {
            localStorage.removeItem(key);
        });

        loadLibrary();
        loadJournal();
        showToast("All data has been wiped");
        showView("home");
    });
});