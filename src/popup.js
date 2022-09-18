let colorPicker = document.getElementById('popupColorPicker');

const setBackgroundColor = (e) => {
    chrome.storage.sync.set({ background: e.target.value });
};

colorPicker?.addEventListener('change', setBackgroundColor);

chrome.storage.sync.get(['background'], ({ background }) => {
    colorPicker.setAttribute('value', background);
});
