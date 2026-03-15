export function loadLibrary() {
    loadSection("saved-quotes", "quotes");
    loadSection("saved-songs", "songs");
    loadSection("saved-prompts", "prompts");
}

function loadSection(containerId, storageKey) {
    const container = document.getElementById(containerId);
    const items = JSON.parse(localStorage.getItem(storageKey)) || [];

    container.innerHTML = "";

    if (items.length === 0) {
        container.classList.add("empty");
        container.innerHTML = `<p class="empty-text">No saved ${storageKey} yet.</p>`;
        return;
    }

    container.classList.remove("empty");

    items.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("library-item");

        if (typeof item === "string") {
            div.textContent = item;
        } else {
            div.textContent = `${item.title} - ${item.artist}`;
        }

        container.appendChild(div);
    });
}