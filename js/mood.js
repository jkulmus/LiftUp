const MOOD_MAP = {
    'Lo-Fi Chill': ['stressed', 'overwhelmed', 'anxious', 'busy', 'pressure','panic'],
    'Uplifting Acoustic': ['sad', 'lonely', 'unhappy', 'cry', 'down', 'depressed'],
    'Nature Ambience': ['tired', 'exhausted', 'burnout', 'sleepy', 'drain', 'energy', 'long day', 'restless', 'heavy'],
    'Calm Piano': ['angry', 'mad', 'frustrated', 'annoyed', 'irritated'],
    'Inspirational': ['lazy', 'stuck', 'unmotivated', 'bored', 'goal', 'future']
};

export function analyzeMood(text) {
    const input = text.toLowerCase();
    let bestMatch = null;
    let maxMatches = 0;

    for (const [mood, keywords] of Object.entries(MOOD_MAP)) {
        let count = 0;

        keywords.forEach(keyword => {
            if (keyword.includes(" ")) {
                if (input.includes(keyword)) {
                    count++;
                }
            } else {
                const regex = new RegExp(`\\b${keyword}\\b`, "i");
                if (regex.test(input)) {
                    count++;
                }
            }
        });

        if (count > maxMatches) {
            maxMatches = count;
            bestMatch = mood;
        }
    }

    return bestMatch || "Inspirational";
}