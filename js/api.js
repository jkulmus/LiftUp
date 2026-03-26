import { cache } from "react";

let cachedPrompts = [];

export async function getQuote() {
    try {
        const res = await fetch(`https://api.adviceslip.com/advice?ts=$Date.now()}`);
        const data = await res.json();
        return data?.slip?.advice || "Keep going!";
    } catch {
        return "Keep going, you're doing better than you think.";
    }
}

export async function getPrompts() {
    try {
        if (cachedPrompts.length === 0) {
            const res = await fetch("https://type.fit/api/quotes");
            cachedPrompts = await res.json();
        }

        const random = cachedPrompts[Math.floor(Math.random() * cachedPrompts.length)];
        return random.text;

    } catch {
        return "Write about something you're grateful for.";
    }
}

export async function getSong(mood) {
    const searchTerms = {
        "Lo-Fi Chill": "lofi chill beats",
        "Uplifting Acoustic": "acoustic happy",
        "Nature Ambience": "nature relax sounds",
        "Calm Piano": "calm piano",
        "Inspirational": "motivational music"
    };

    const term = searchTerms[mood] || "lofi chill";

    try {
        const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(term)}&limit=1`);

        const data = await res.json();

        if (!data.results || data.results.length === 0) throw new Error();

        const track = data.results[0];

        return {
            title: track.trackName,
            artist: track.artistName,
            previewUrl: track.previewUrl,
            artwork: track.artworkUrl100.replace("100x100", "400x400")
        };

    } catch {
        return {
            title: "Chill Beats",
            artist: "Lo-Fi Artist",
            previewUrl: "",
            artwork: "https://via.placeholder.com/400"
        };
    }
}