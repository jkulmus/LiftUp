const MOOD_MAP = {
    'Lo-Fi Chill': [
        'stressed', 'overwhelmed', 'anxious', 'busy', 'deadline', 'work',
        'pressure', 'finals', 'exams', 'test', 'worry', 'panic'
    ],

    // Sad / Low Energy
    'Uplifting Acoustic': [
        'sad', 'lonely', 'blue', 'unhappy', 'cry', 'heartbreak',
        'miss', 'down', 'gloomy', 'disappointed'
    ],

    // Tired / Burnout
    'Nature Ambience': [
        'tired', 'exhausted', 'burnout', 'sleepy', 'drain', 'energy',
        'long day', 'restless', 'heavy'
    ],

    // Angry / Frustrated
    'Calm Piano': [
        'angry', 'mad', 'frustrated', 'annoyed', 'hate', 'furious',
        'unfair', 'irritated', 'vent'
    ],

    // Default / Seeking Motivation
    'Inspirational': [
        'lazy', 'stuck', 'procrastinating', 'start', 'goal', 'dream',
        'future', 'bored', 'nothing'
    ]
};

export function analyzeMood(text) {
    const input = text.toLowerCase();

    for (const [vibe, keywords] of Object.entries(MOOD_Map)) {
        if (keywords.some(word => input.includes(word))) {
            return vibe;
        }
    }

    return "Inspirational";
}