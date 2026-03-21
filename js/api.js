export async function getQuote() {
    try {
        const res = await fetch("https://api.adviceslip.com/advice");
        const data = await res.json();
        return data.slip.advice;
    } catch {
        return "Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle.";
    }
}

export async function getPrompts() {
    try {
        const res = await fetch('https://type.fit/api/quotes');
        const data = await res.json();
        const random = data[Math.floor(Math.random() * data.length)];
        return random.text;
    } catch {
        return "What is one thing that made you smile today?";
    }
}

export async function getSong(mood) {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(mood + " lofi")}&limit=1&media=music`;
    try {
        const res = await fetch(url);
        const data = await res.json();
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