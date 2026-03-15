import { getQuote, getPrompts, getSong } from "./api.js";
import { loadLibrary } from "./library.js";

// DOM Elements
const homeView = document.getElementById('home-view');
const resultsView = document.getElementById('results-view');
const libraryView = document.getElementById("library-view");

const supportBtn = document.getElementById("get-support-btn");
const backBtn = document.getElementById('back-to-home');
const backLibraryBtn = document.getElementById("back-to-home-from-library");
const userInput = document.getElementById('user-input');

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

    if (view === "home") homeView.classList.remove("hidden");
    if (view === "results") resultsView.classList.remove("hidden");
    if (view === "library") {
        libraryView.classList.remove("hidden");
        loadLibrary();
    }
}

// Show Results
supportBtn.addEventListener('click', async () => {
    const text = userInput.value.trim();
    
    if (!text) return;
    
    const vibe = text.includes("sad") || text.includes("overwhelmed")
        ? "Lo-Fi Chill"
        : "Inspirational";
    
    showView("results");
    
    const quote = await getQuote();
    const prompt = await getPrompts();
    const song = await getSong(vibe);
    
    // Update UI
    document.getElementById("result-quote").innerText = `"${quote}"`;
    document.getElementById("journal-prompt").innerText = prompt;

    document.getElementById("song-title").innerText = song.title;
    document.getElementById("song-artist").innerText = song.artist;
    document.getElementById("album-art").src = song.artwork;
    document.getElementById("song-preview").src = song.preview;
});

// Back Button
backBtn.addEventListener("click", () => showView("home"));
backLibraryBtn.addEventListener("click", () => showView("home"));

// Save Functions
function saveToLibrary(key, value) {
    const items = JSON.parse(localStorage.getItem(key)) || [];
    items.push(value);
    localStorage.setItem(key, JSON.stringify(items));
}

document.getElementById("save-quote-btn").onclick = () => {
    const quote = document.getElementById("result-quote").innerText;
    saveToLibrary("quotes", quote);
};

document.getElementById("save-song-btn").onclick = () => {
    const song = {
        title: document.getElementById("song-title").innerText,
        artist: document.getElementById("song-artist").innerText
    };
    saveToLibrary("songs", song);
};

document.getElementById("save-prompt-btn").onclick = () => {
    const prompt = document.getElementById("journal-prompt").innerText;
    saveToLibrary("prompts", prompt);
};