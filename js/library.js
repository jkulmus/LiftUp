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

    items.forEach((item, index) => {
        const div = document.createElement("div");
        div.classList.add("library-item");

        const content = document.createElement("span");
        content.classList.add("item-content");
        content.textContent = typeof item === "string" ? item : `${item.title} - ${item.artist}`;

        const delBtn = document.createElement("button");
        delBtn.classList.add("delete-item-btn");
        delBtn.innerHTML = "&times;";
        delBtn.setAttribute("aria-label", "Delete item");

        delBtn.addEventListener("click", () => {
            deleteItem(storageKey, index);
        });

        div.appendChild(content);
        div.appendChild(delBtn);
        container.appendChild(div);
    });
}

function deleteItem(storageKey, index) {
    const items = JSON.parse(localStorage.getItem(storageKey)) || [];

    items.splice(index, 1);

    localStorage.setItem(storageKey, JSON.stringify(items));

    loadLibrary();
}