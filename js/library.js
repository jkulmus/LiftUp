function getStorage(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

export function saveToLibrary(key, data) {
    const items = getStorage(key);
    const exists = items.some(i => JSON.stringify(i) === JSON.stringify(data));
    if (exists) return alert("Already in your library!");

    items.unshift(data);
    localStorage.setItem(key, JSON.stringify(items));
    alert("Saved!");
}

export function loadLibrary() {
    loadSection("saved-quotes", "quotes");
    loadSection("saved-songs", "songs");
    loadSection("saved-prompts", "prompts");
}

function loadSection(containerId, storageKey) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const items = getStorage(storageKey);
    container.innerHTML = "";

    if (items.length === 0) {
        container.classList.add("empty");
        container.innerHTML = `<p class="empty-text">No saved ${storageKey} yet.</p>`;
        return;
    }

    container.classList.remove("empty");

    items.forEach((item, index) => {
        const div = document.createElement("div");
        div.classList.add("library-item");

        const content = document.createElement("span");
        content.classList.add("item-content");
        content.textContent = typeof item === "string" ? item : `${item.title} - ${item.artist}`;

        const delBtn = document.createElement("button");
        delBtn.innerHTML = "&times;";
        delBtn.className = "delete-item-btn";
        delBtn.onclick = () => {
            items.splice(index, 1);
            localStorage.setItem(storageKey, JSON.stringify(items));
            loadLibrary();
        };

        div.append(content, delBtn);
        container.appendChild(div);
    });
}