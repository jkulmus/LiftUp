export async function getQuote() {
    try {
        const res = await fetch("https://zenquotes.it/api/random");
        const data = await res.json();
        return `${data[0].q} - ${data[0].a}`;
    } catch {
        return "Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle.";
    }
}

export async function getPrompts() {
    const prompts = [
        "What is one thing that made you smile today?",
        "What are you grateful for right now?",
        "Describe a recent challenge and how you overcame it.",
        "What challenege are you facing and how can you grow from it?",
        "What does your ideal future look like?",
        "Write about a time you felt truly at peace.",
        "What is something you're proud of?",
        "Describe a place where you feel safe and happy.",
    ];
    return prompts[Math.floor(Math.random() * prompts.length)];
}

export async function getSong(mood) {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(mood + " music")}&limit=1&media=music`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (!data.results || data.results.length === 0) {
            throw new Error("No results");
        }

        const track = data.results[0];

        return {
            title: track.trackName,
            artist: track.artistName,
            previewUrl: track.previewUrl,
            artwork: track.artworkUrl100.replace("100x100", "400x400")
        };
    } catch {
        return {
            title: "Peaceful Mind",
            artist: "Ambient Sounds",
            previewUrl: "",
            artwork: "https://via.placeholder.com/400?text=Relax"
        };
    }
}