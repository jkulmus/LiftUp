function getStorage(key) {
    try {
        return JSON.parse(localStorage.getItem(key)) || [];
    } catch {
        return [];
    }
}

export function saveToLibrary(key, data) {
    const items = getStorage(key);

    const exists = items.some(i =>
        typeof i === "string"
            ? i === data
            : i.title === data.title && i.artist === data.artist
    );

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
        content.textContent = 
            typeof item === "string"
                ? item
                : `${item.title} - ${item.artist}`;
                
        const delBtn = document.createElement("button");
        delBtn.innerHTML = "&times;";
        delBtn.className = "delete-item-btn";

        delBtn.addEventListener("click", () => {
            const updated = getStorage(storageKey).filter((_, i) => i !== index);
            localStorage.setItem(storageKey, JSON.stringify(updated));
            loadLibrary();
        });

        div.append(content, delBtn);
        container.appendChild(div);
    });
}