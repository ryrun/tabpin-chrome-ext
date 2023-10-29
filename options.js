// Saves options to chrome.storage
const saveOptions = () => {
    const urls = document.getElementById('urls').value;

    chrome.storage.sync.set(
        {urls: urls},
        () => {
            // Update status to let user know options were saved.
            const status = document.getElementById('status');
            status.textContent = 'Options saved.';
            setTimeout(() => {
                status.textContent = '';
            }, 750);
        }
    );
};

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
const restoreOptions = () => {
    chrome.storage.sync.get(
        {urls: ''},
        (items) => {
            document.getElementById('urls').value = items.urls;
        }
    );
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);