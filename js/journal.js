function getStorage(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

export function loadJournal() {
    const container = document.getElementById("journal-entries");
    if (!container) return;

    const entries = getStorage("journal");
    container.innerHTML = "";

    if (entries.length === 0) {
        container.classList.add("empty");
        container.innerHTML = `<p class= "empty-text">No journal entries yet. Start writing today.</p>`;
        return;
    }

    container.classList.remove("empty");

    const fragment = document.createDocumentFragment();

    entries.forEach(entry => {
        const div = document.createElement("div");
        div.classList.add("journal-entry-item");

        const date = document.createElement("div");
        date.classList.add("journal-entry-date");
        date.textContent = entry.date;

        const mood = document.createElement("div");
        mood.classList.add("journal-entry-mood");
        mood.textContent = entry.mood;

        const text = document.createElement("div");
        text.classList.add("journal-entry-text");
        text.textContent = entry.text;

        div.append(date, mood, text);
        fragment.appendChild(div);
    });

    container.appendChild(fragment);
}

export function saveJournalEntry(mood, text) {
    const entries = getStorage("journal");

    const newEntry = {
        mood,
        text,
        date: new Date().toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short"
        })
    };

    entries.unshift(newEntry);
    if (entries.length > 50) entries.pop();

    localStorage.setItem("journal", JSON.stringify(entries));
}