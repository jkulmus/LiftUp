import { getQuote, getPrompts, getSong } from "./api.js";
import { loadLibrary } from "./library.js";
import { loadJournal, saveJournalEntry } from "./journal.js";
import { analyzeMood } from "./mood.js";

// DOM Elements
const homeView = document.getElementById('home-view');
const resultsView = document.getElementById('results-view');
const libraryView = document.getElementById("library-view");
const journalView = document.getElementById("journal-view");
const settingsView = document.getElementById("settings-view");

const supportBtn = document.getElementById("get-support-btn");
const userInput = document.getElementById('user-input');
const resetDataBtn = document.getElementById("reset-data-btn");

// Navigation
function showView(view) {
    [homeView, resultsView, libraryView, journalView, settingsView].forEach(v => v.classList.add("hidden"));

    if (view === "home") homeView.classList.remove("hidden");
    if (view === "results") resultsView.classList.remove("hidden");
    if (view === "library") {
        libraryView.classList.remove("hidden");
        loadLibrary();
    }
    if (view === "journal") {
        journalView.classList.remove("hidden");
        loadJournal();
    }
    if (view === "settings") settingsView.classList.remove("hidden");
}

// Global listener for footer buttons (data-view)
document.querySelectorAll("[data-view]").forEach(btn => {
    btn.addEventListener("click", () => showView(btn.dataset.view));
});

// Back buttons
document.querySelectorAll(".back-btn").forEach(btn => {
    btn.addEventListener("click", () => showView("home"));
});

// Support Flow
supportBtn.addEventListener('click', async () => {
    const text = userInput.value.trim();

    if (!text) {
        alert("Please enter how you're feeling.");
        return;
    }

    const originalBtnText = supportBtn.innerText;
    supportBtn.innerText = "Finding inspiration...";
    supportBtn.disabled = true;
    
    const vibe = analyzeMood(text);
    
    try {
        const [quote, prompt, song] = await Promise.all([
            getQuote(),
            getPrompts(),
            getSong(vibe)
        ]);

        showView("results");

        // Update UI
        document.getElementById("result-quote").innerText = `"${quote}"`;
        document.getElementById("journal-prompt").innerText = prompt;
        document.getElementById("song-title").innerText = song.title;
        document.getElementById("song-artist").innerText = song.artist;
        document.getElementById("album-art").src = song.artwork;
        document.getElementById("song-preview").src = song.previewUrl;

        // Reset Save Buttons
        document.querySelectorAll('.save-btn').forEach(btn => {
            btn.disabled = false;
            btn.style.background = "";
            if (btn.id.includes('quote')) btn.innerText = 'Save Quote';
            if (btn.id.includes('song')) btn.innerText = 'Save Song';
            if (btn.id.includes('prompt')) btn.innerText = 'Save Prompt';
        });

    } catch (error) {
        console.error("Error fetching inspiration:", error);
        alert("Something went wrong. Please try again!");
    } finally {
        supportBtn.innerText = originalBtnText;
        supportBtn.disabled = false;
    }
});


// Library Save Functions
function saveToLibrary(key, value) {
    const items = JSON.parse(localStorage.getItem(key)) || [];

    const isDuplicate = items.some(item => JSON.stringify(item) === JSON.stringify(value));
    if (!isDuplicate) {
        items.push(value);
        localStorage.setItem(key, JSON.stringify(items));
    }
}

document.getElementById("save-quote-btn").addEventListener("click", () => {
    saveToLibrary("quotes", document.getElementById("result-quote").innerText);
    updateSaveButton("save-quote-btn");
});

document.getElementById("save-song-btn").addEventListener("click", () => {
    const song = {
        title: document.getElementById("song-title").innerText,
        artist: document.getElementById("song-artist").innerText
    };
    saveToLibrary("songs", song);
    updateSaveButton("save-song-btn");
});

document.getElementById("save-prompt-btn").addEventListener("click", () => {
    saveToLibrary("prompts", document.getElementById("journal-prompt").innerText);
    updateSaveButton("save-prompt-btn");
});

// Journal functions
document.getElementById("save-journal-btn").addEventListener("click", () => {
    const mood = document.getElementById("journal-mood").value;
    const text = document.getElementById("journal-entry").value.trim();
    if (!mood || !text) return;

    saveJournalEntry(mood, text);
    document.getElementById("journal-entry").value = "";
    document.getElementById("journal-mood").value = "";
    loadJournal();
});

// Settings
resetDataBtn.addEventListener("click", () => {
    if (confirm("Delete everything? This cannot be undone.")) {
        localStorage.clear();
        showView("home");
    }
});

// Helpers
function updateSaveButton(buttonId) {
    const btn = document.getElementById(buttonId);
    const originalText = btn.innerText;
    btn.innerText = "Saved! ✓";
    btn.style.background = "#2ecc71";
    btn.disabled = true;
    setTimeout(() => {
        btn.innerText = originalText;
        btn.style.background = "";
        btn.disabled = false;
    }, 2000);
}