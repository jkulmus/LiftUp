const MOOD_MAP = {
    'Lo-Fi Chill': [
        'stressed', 'overwhelmed', 'anxious', 'busy', 'pressure','panic'
    ],
    'Uplifting Acoustic': [
        'sad', 'lonely', 'unhappy', 'cry', 'down', 'depressed'
    ],
    'Nature Ambience': [
        'tired', 'exhausted', 'burnout', 'sleepy', 'drain', 'energy',
        'long day', 'restless', 'heavy'
    ],
    'Calm Piano': [
        'angry', 'mad', 'frustrated', 'annoyed', 'irritated'
    ],
    'Inspirational': [
        'lazy', 'stuck', 'unmotivated', 'bored', 'goal', 'future'
    ]
};

export function analyzeMood(text) {
    const input = text.toLowerCase();

    let bestMatch = "Inspirational";
    let maxMatches = 0;

    for (const [vide, keywords] of Object.entries(MOOD_MAP)) {
        let count = 0;

        keywords.forEach(word => {
            if (input.includes(word)) count++;
        });

        if (count > maxMatches) {
            maxMatches = count;
            bestMatch = vibe;
        }
    }

    return bestMatch;
}