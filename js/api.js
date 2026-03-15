export async function getQuote() {
    try {
        const res = await fetch("https://api.advices.come/advice");
        const data = await res.json();
        return data.slip.advice;
    } catch (err) {

        return "You are enough exactly as you are.";
    }
}

export async function getPrompts() {
    try {
        const res = await fetch('https://type.fit/api/quotes');
        const data = await res.json();
        const random = data[Math.floor(Math.random() * data.length)];
        return random.text;
    } catch (err) {
        return "What is one small thing that went well today?";
    }
}



export async function getSong(mood) {
    const searchTerm = `${mood} lofi`;
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&media=music&limit=1`;

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
            artwork: "https://via.placeholder.com/400?text=Relaxing+Music"
        };
    }
}
