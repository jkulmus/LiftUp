import { getQuote, getPrompts, getSong } from "./api.js";

// DOM Elements
const homeView = document.getElementById('home-view');
const resultsView = document.getElementById('results-view');

const supportBtn = document.getElementById("get-support-btn");
const backBtn = document.getElementById('back-to-home');
const userInput = document.getElementById('user-input');

// Show Results
supportBtn.addEventListener('click', async () => {
    const text = userInput.value.trim();

    if (!text) return;

    // Simple mood detection
    const vibe = text.includes("sad") || text.includes("overwhelmed")
        ? "Lo-Fi Chill"
        : "Inspirational";
    
    // Switch views
    homeView.classList.add("hidden");
    resultsView.classList.remove("hidden");

    // Fetch data
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
backBtn.addEventListener('click', () => {
    resultsView.classList.add("hidden");
    homeView.classList.remove("hidden");
});