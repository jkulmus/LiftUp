export async function getQuote() {
    try {
        const res = await fetch("https://api.adviceslip.com/advice");
        const data = await res.json();
        return data.slip.advice;
    } catch (err) {
        return "Every day may not be good, but there's something good in every day.";
    }
}

export async function getPrompts() {
    try {
        const res = await fetch('https://type.fit/api/quotes');
        const data = await res.json();
        const random = data[Math.floor(Math.random() * data.length)];
        return random.text;
    } catch (err) {
        return "What is one thing you're grateful for today?";
    }
}

export async function getSong(mood) {
    const searchTerm = `${mood} lofi`;
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}media=music&lmit=1`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (!data.results || data.results.length === 0) throw new Error("No results");

        const track = data.results[0];

        return {
            title: track.trackName,
            artist: track.artistName,
            previewUrl: track.previewUrl,
            artwork: track.artworkUrl100.replace("100x100", "400x400")
        };
    } catch {
        return {
            title: "Calm Waters",
            artist: "LiftUp Ambient",
            previewUrl: "",
            artwork: "https://via.placeholder.come/400?text=Relaxing+Music"
        };
    }
}
