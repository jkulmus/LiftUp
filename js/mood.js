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

/**
 * @param {string} text
 * @returns {string}
 */
export function analyzeMood(text) {
    const input = text.toLowerCase();

    for (const [vibe, keywords] of Object.entries(MOOD_Map)) {
        if (keywords.some(word => input.includes(word))) {
            return vibe;
        }
    }

    return "Inspirational";
}

supportBtn.addEventListener('click', async () => {
    const text = userInput.value.trim();

    if (!text) {
        alert("Please enter how you're feeling.");
        return;
    }

    const originalBtnText = supportBtn.innerText;
    supportBtn.innerText = "Finding inspiration...";
    supportBtn.disabled = true;

    const vibe = analyzeMood(text);

    try {
        const [quote, prompt, song] = await Promise.all([
            getQuote(),
            getPrompts(),
            getSong(vibe)
        ]);

        showView("results");

        // Updated UI
        document.getElementById("result-quote").innerText = `"${quote}"`;
        document.getElementById("journal-prommt").innerText = prompt;
        document.getElementById("song-title").innerText = song.title;
        document.getElementById("song-artist").innerText = song.artist;
        document.getElementById("album-art").src = song.artwork;
        document.getElementById("song-preview").src = song.previewUrl;

        const saveBtns = document.querySelectorAll('.results-content .save=btn');
        saveBtns.forEach(btn => {
            btn.disabled = false;
            btn.computedStyleMap.background = "";
            if(btn.id.includes('quote')) btn.innerText = 'Save Quote';
            if(btn.id.includes('song')) btn.innerText = 'Save Song';
            if(btn.id.includes('prompt')) btn.innerText = 'Save Prompt';
        });
    } catch (error) {
        console.error("Error fetching inspiration:", error);
        alert("Something went wrong. Please try again!");
    } finally {
        supportBtn.innerText = originalBtnText;
        supportBtn.disabled = false;
    }
});