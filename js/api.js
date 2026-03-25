export async function getQuote() {
    try {
        const res = await fetch("https://api.adviceslip.com/advice", { cache: "no-cache" });
        const data = await res.json();
        return data.slip.advice;
    } catch {
        return "Keep pushing forward, your effort matters.";
    }
}

export async function getPrompts() {
    try {
        const res = await fetch("https://type.fit/api/quotes", { cache: "no-cache"});
        const data = await res.json();
        const random = data[Math.floor(Math.random() * data.length)];
        return random.text;
    } catch {
        return "Write about one thing you're looking forward to this week.";
    }
}

export async function getSong(mood) {
    const searchTerms = {
        "Lo-Fi Chill": "lofi chill beats",
        "Uplifting Acoustic": "acoustic happy",
        "Nature Ambience": "nature relax sounds",
        "Calm Piano": "calm piano instrumental",
        "Inspirational": "motivational music"
    };

    const term = searchTerms[mood] || "lo-fi chill";
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&limit=1&media=music`;
    
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
        throw new Error();
    } catch {
        return {
            title: "Chill Beats",
            artist: "Lo-Fi Artist",
            previewUrl: "",
            artwork: "https://via.placeholder.com/400?text=Releasing+Music"
        };
    }
}