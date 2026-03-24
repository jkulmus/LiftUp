export async function getQuote() {
    try {
        const res = await fetch("https://api.adviceslip.com/advice", { cache: "no-cache" });
        const data = await res.json();
        return data.slip.advice;
    } catch (err) {
        return "Keep pushing forward, your effort matters.";
    }
}

export async function getPrompts() {
    try {
        const res = await fetch('https://type.fit/api/quotes');
        const data = await res.json();
        const randomQuote = data[Math.floor(Math.random() * data.length)];
        return randomQuote.text;
    } catch (err) {
        return "Write about one thing you're looking forward to this week.";
    }
}

export async function getSong(mood) {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(mood + " lofi")}&limit=1&media=music`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.results.length > 0) {
            const track = data.results[0];
            return {
                title: track.trackName,
                artist: track.artistName,
                previewUrl: track.previewUrl,
                artwork: track.artworkUrl100.replace("100x100", "400x400")
            };
        }
        throw new Error("No songs found");
    } catch (err) {
        return {
            title: "Midnight City",
            artist: "Lo-Fi Study",
            previewUrl: "",
            artwork: "https://via.placeholder.com/400?text=Relasing+Music"
        };
    }
}