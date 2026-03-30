import { showToast } from "./library.js";

function getStorage (key) {
    try {
        return JSON.parse(localStorage.getItem(key)) || [];
    } catch (error) {
        console.error(`Error reading ${key} from storage:`, error);
        return [];
    }
}

function setStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
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

    entries.forEach(entry => {
        const div = document.createElement("div");
        div.classList.add("journal-entry-item");

        const dateEl = document.createElement("div");
        dateEl.classList = "journal-entry-date";
        dateEl.textContent = entry.date;

        const moodEl = document.createElement("div");
            moodEl.className = "journal-entry mood";
            moodEl.textContent = entry.text;

            const textEl = document.createElement("div");
            textEl.classList = "journal-entry-text";
            textEl.textContent = entry.text;

            div.append(dateEl, moodEl, textEl);
            container.appendChild(div);
    });
}

export function saveJournalEntry(mood, text) {
    if (!mood || !text) return;

    const entries = getStorage("journal");

    entries.unshift({
        mood,
        text,
        date: new Date().toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short"
        })
    });

    if (entries.length > 50) {
        entries.pop();
    }

    setStorage("journal", entries);
    showToast("Entry Saved!");
}