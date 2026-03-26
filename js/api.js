let cachedPrompts = [];

export async function getQuote() {
    try {
        const res = await fetch(`https://api.adviceslip.com/advice?timestamp=${Date.now()}`);
        if (!res.ok) throw new Error("Quote API failed");

        const data = await res.json();
        return data?.slip?.advice || "Keep pushing forward.";

    } catch (error) {
        console.error("Quote API error:", error);
        return "Keep pushing forward, your effort matters.";
    }
}

export async function getPrompts() {
    try {
        if (cachedPrompts.length === 0) {
            const res = await fetch("https://type.fit/api/quotes");
            if (!res.ok) throw new Error("Prompt API failed");

            cachedPrompts = await res.json();
        }

        const random = cachedPrompts[Math.floor(Math.random() * cachedPrompts.length)];
        return random.text;

    } catch (error) {
        console.error("Prompt API error:", error);
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
        if (!res.ok) throw new Error("Song API failed");

        const data = await res.json();
        
        if (!data.results || data.results.length === 0) {
            const track = data.results[0];

            return {
                title: track.trackName,
                artist: track.artistName,
                previewUrl: track.previewUrl,
                artwork: track.artworkUrl100.replace("100x100", "400x400")
            };
        }

        throw new Error("No song found");

    } catch (error) {
        console.error("Song API error:", error);
        return {
            title: "Chill Beats",
            artist: "Lo-Fi Artist",
            previewUrl: "",
            artwork: "https://via.placeholder.com/400?text=Releasing+Music"
        };
    }
}