function getStorage(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
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
                ? item : `${item.title} - ${item.artist}`;

        const delBtn = document.createElement("button");
        delBtn.classList.add("delete-item-btn");
        delBtn.innerHTML = "&times;";
        delBtn.title = "Delete item";

        delBtn.addEventListener("click", () => {
            deleteItem(storageKey, index);
        });

        div.append(content, delBtn);
        container.appendChild(div);
    });
}

function deleteItem(key, index) {
    const items = getStorage(key);
    items.splice(index, 1);
    localStorage.setItem(key, JSON.stringify(items));
    loadLibrary();
}