import { getQuote, getSong } from "./api.js";

// DOM
const homeView = document.getElementById('home-view');
const resultsView = document.getElementById('results-view');
const backBtn = document.getElementById('go-home');
const userInput = document.getElementById('user-input');

// Event click
supportBtn.addEventListener('click', async () => {
    const text = userInput.value;

    // Determine Vibe
    const vibe = text.includes('sad') || text.includes('overwhelmed') ? 'Lo-Fi Chill' : 'Inspirational';

    // Transition
    homeView.classList.add("hidden");
    resultsView.classList.remove("hidden");

    // API Calls
    const quote = await getQuote();
    const song = await getSong(vibe);

    // Update UI
    document.getElementById('result-quote').innerText = `"${quote}"`;
    document.getElementById('song-title').innerText = song.title;
    document.getElementById('song-artist').innerText = song.artist;
    document.getElementById('album-art').src = song.artwork;
    document.getElementById('song-preview').src = song.preview;
});

// Back Button
backBtn.addEventListener('click', () => {
    resultsView.classList.add('hidden');
    homeView.classList.remove('hidden');
});