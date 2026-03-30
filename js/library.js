function getStorage(key) {
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

// Toast logic
export function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.remove("hidden");

    if (window.toastTimeout) {
        clearTimeout(window.toastTimeout);
    }

    window.toastTimeout = setTimeout(() => {
        toast.classList.add("hidden");
    }, 2500);
}

export function saveToLibrary(key, data) {
    const items = getStorage(key);

    const exists = items.some(item =>
        typeof item === "string"
            ? item === data
            : item.title === data.title && item.artist === data.artist
    );

    if (exists) {
        showToast("Already saved!");
        return;
    }

    items.unshift(data);
    setStorage(key, items);
    showToast("Saved!");
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
        container.innerHTML = `<p class="empty-text">Nothing saved yet.</p>`;
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
        delBtn.type = "button";
        delBtn.innerHTML = "&times;";
        delBtn.className = "delete-item-btn";
        delBtn.setAttribute("aria-label", "Delete saved item");

        delBtn.addEventListener("click", () => {
            const updated = getStorage(storageKey).filter((_, i) => i !== index);
            setStorage(storageKey, updated);
            loadLibrary();
            showToast("Removed");
        });

        div.append(content, delBtn);
        container.appendChild(div);
    });
}