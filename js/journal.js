function getStorage (key) {
    try {
        return JSON.parse(localStorage.getItem(key)) || [];
    } catch {
        return [];
    }
}

export function loadJournal() {
    const container = document.getElementById("journal-entries");
    if (!container) return;

    const entries = getStorage("journal");
    container.innerHTML = "";

    if (entries.length === 0) {
        container.classList.add("empty");
        container.innerHTML = `<p class="empty-text">No journal entries yet.</p>`;
        return;
    }

    container.classList.remove("empty");

    const fragment = document.createDocumentFragment();

    entries.forEach(entry => {
        const div = document.createElement("div");
        div.classList.add("journal-entry-item");

        div.innerHTML = `
            <div class="journal-entry-date">${entry.date}</div>
            <div class="journal-entry-mood">${entry.mood}</div>
            <div class="journal-entry-text">${entry.text}</div>
        `;

        fragment.appendChild(div);
    });

    container.appendChild(fragment);
}

export function saveJournalEntry(mood, text) {
    if (!mood || !text) return;

    const entries = getStorage("journal");

    entries.unshift({
        mood,
        text,
        date: new Date().toLocaleString()
    });

    if (entries.length > 50) entries.pop();

    localStorage.setItem("journal", JSON.stringify(entries));
}