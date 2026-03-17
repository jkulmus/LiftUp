import { getQuote, getPrompts, getSong } from "./api.js";
import { loadLibrary } from "./library.js";
import { loadJournal, saveJournalEntry } from "./journal.js";
import { analyzeMood } from "./mood.js";

// DOM Elements
const homeView = document.getElementById('home-view');
const resultsView = document.getElementById('results-view');
const libraryView = document.getElementById("library-view");
const journalView = document.getElementById("journal-view");

const supportBtn = document.getElementById("get-support-btn");
const backBtn = document.getElementById('back-to-home');
const backLibraryBtn = document.getElementById("back-to-home-from-library");
const backJournalBtn = document.getElementById("back-to-home-from-journal");

const saveJournalBtn = document.getElementById("save-journal-btn");
const userInput = document.getElementById('user-input');

const settingsView = document.getElementById("settings-view");
const backSettingsBtn = document.getElementById("back-to-home-from-settings");
const resetDataBtn = document.getElementById("reset-data-btn");

// Navigation
document.querySelectorAll("[data-view]").forEach(btn => {
    btn.addEventListener("click", () => {
        const target = btn.dataset.view;
        showView(target);
    });
});

function showView(view) {
    homeView.classList.add("hidden");
    resultsView.classList.add("hidden");
    libraryView.classList.add("hidden");
    journalView.classList.add("hidden");
    settingsView.classList.add("hidden");

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

// Show Results
supportBtn.addEventListener('click', async () => {
    const text = userInput.value.trim();

    if (!text) {
        alert("Please enter how you're feeling.");
        return;
    }

    const originalBtnText = supportBtn.innerText;
    supportBtn.innerText = "Finding inspiration...";
    supportBtn.disabled = true;

    let vibe = analyzeMood(text) || "Inspirational";
    const input = text.toLowerCase();

    if (input.includes("sad") || input.includes("lonely") || input.includes("blue")) {
        vibe = "Uplifting Acoustic";
    } else if (input.includes("stressed") || input.includes("overwhelmed") || input.includes("anxious")) {
        vibe = "Lo-Fi Chill";
    } else if (input.includes("tired") || input.includes("burnout") || input.includes("exhausted")) {
        vibe = "Nature Ambience";
    } else if (input.includes("angry") || input.includes("frustrated")) {
        vibe = "Calm Piano";
    }

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

        const saveBtns = document.querySelectorAll('.results-content .save-btn');
        saveBtns.forEach(btn => {
            btn.disabled = false;
            btn.innerText = btn.id.includes('quote') ? 'Save Quote' : (btn.id.includes('song') ? 'Save Song' : 'Save Prompt');
            btn.style.background = "";
        });
    } catch (error) {
        console.error("Error fetching inspiration:", error);
        alert("Something went wrong. Please try again!");
    } finally {
        supportBtn.innerText = originalBtnText;
        supportBtn.disabled = false;
    }
});

// Back Button
backBtn.addEventListener("click", () => showView("home"));
backLibraryBtn.addEventListener("click", () => showView("home"));
backJournalBtn.addEventListener("click", () => showView("home"));

// Save Functions
function saveToLibrary(key, value) {
    const items = JSON.parse(localStorage.getItem(key)) || [];

    const isDuplicate = items.some(item =>
        JSON.stringify(item) === JSON.stringify(value)
    );

    if (!isDuplicate) {
        items.push(value);
        localStorage.setItem(key, JSON.stringify(items));
        alert("Saved to library!");
    }
}

document.getElementById("save-quote-btn").addEventListener("click", () => {
    const quote = document.getElementById("result-quote").innerText;
    saveToLibrary("quotes", quote);
});

document.getElementById("save-song-btn").addEventListener("click", () => {
    const song = {
        title: document.getElementById("song-title").innerText,
        artist: document.getElementById("song-artist").innerText
    };
    saveToLibrary("songs", song);
});

document.getElementById("save-prompt-btn").addEventListener("click", () => {
    const prompt = document.getElementById("journal-prompt").innerText;
    saveToLibrary("prompts", prompt);
});

// Journal save
saveJournalBtn.addEventListener("click", () => {
    const mood = document.getElementById("journal-mood").value;
    const text = document.getElementById("journal-entry").value.trim();

    if (!mood || !text) return;

    saveJournalEntry(mood, text);

    // clear fields
    document.getElementById("journal-entry").value = "";
    document.getElementById("journal-mood").value = "";

    loadJournal();
});

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
    }), 2000;
}