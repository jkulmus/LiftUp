export function loadJournal() {
    const container = document.getElementById("journal-entries");
    const entries = JSON.parse(localStorage.getItem("journal")) || [];

    container.innerHTML = "";

    if (entries.length === 0) {
        container.classList.add("empty");
        container.innerHTML = `<p class="empty-text">No journal entries yet.</p>`;
        return;
    }

    container.classList.remove("empty");

    entries.forEach(entry => {
        const div = document.createElement("div");
        div.classList.add("journal-entry-item");

        div.innerHTML = `
            <div class="journal-entry-date">${entry.date}</div>
            <div class="journal-entry-mood">${entry.mood}</div>
            <div class="journal-entry-text">${entry.text}</div>
        `;

        container.appendChild(div);
    });
}

export function saveJournalEntry(mood, text) {
    const entries = JSON.parse(localStorage.getItem("journal")) || [];

    const newEntry = {
        mood,
        text,
        date: new Date().toLocaleDateString()
    };

    entries.unshift(newEntry);
    localStorage.setItem("journal", JSON.stringify(entries));
}