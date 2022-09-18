import KEY_CODES from './constants';
import spellCheckService from './services';

let popup;
let activeInput;
let value = '';
let valueArray = [];
let selectedWord = '';
let popupShown = false;

const getInputs = () => {
    return [
        ...document.querySelectorAll(`input[type='text']`),
        ...document.querySelectorAll('textarea'),
        ...document.querySelectorAll(`div[contenteditable='true']`),
    ];
};

let inputs = getInputs();

const setValueFromEvent = (e) => {
    value = e.target.value || e.target.innerHTML;
    valueArray = (e.target.value || e.target.innerHTML).trim().split(' ');
};

const getLastWord = () => {
    return valueArray[valueArray.length] ? value : valueArray[valueArray.length - 1];
};

const mountPopupElement = () => {
    popup = document.createElement('ul');
    popup.classList.add('popup');
    document.body.append(popup);
};

const handleClickOutside = (e) => {
    !popup.contains(e.target) && hidePopup();
};

const updatePopup = (value) => {
    spellCheckService.getSuggestions(value).then(renderPopup);
};

const getSelectedText = () => {
    let selectedValue;
    if (window.getSelection) {
        selectedValue = window.getSelection().toString();
    } else if (document.selection && document.selection.type === 'Text') {
        selectedValue = document.selection.createRange().text;
    }
    return selectedValue;
};

const handleTextSelection = () => {
    selectedWord = getSelectedText().trim();
    selectedWord && updatePopup(selectedWord);
};

const renderOptions = (data) => {
    let optionCount = 0;
    popup.innerHTML = data.reduce(
        (acc, el) => acc + `<li class='popupItem' tabindex='${optionCount++}'>${el}</li>`,
        '',
    );
};

const handleOptionClick = (e) => {
    let selectedIndex = valueArray.indexOf(selectedWord);
    valueArray.splice(selectedIndex, 1, e.target.innerHTML);
    !selectedWord && (valueArray[valueArray.length - 1] = e.target.innerHTML);
    activeInput.value = valueArray.join(' ') + ' ';
    activeInput.innerHTML = valueArray.join(' ') + ' ';
    activeInput.focus();
    hidePopup();
    e.preventDefault();
};

const getFocusItem = (e, data) => {
    e.preventDefault();
    let tabindex = +e.target.getAttribute('tabindex');

    if (e.keyCode === KEY_CODES.downArrow) {
        e.target.setAttribute('tabindex', tabindex++);
        tabindex < data.length && document.querySelector(`li[tabindex='${tabindex}'`).focus();
    } else {
        e.target.setAttribute('tabindex', tabindex--);
        tabindex >= 0 && document.querySelector(`li[tabindex='${tabindex}'`).focus();
    }
};

const handleOptionKeyDown = (data) => (e) => {
    switch (e.keyCode) {
        case KEY_CODES.downArrow:
        case KEY_CODES.upArrow:
            getFocusItem(e, data);
            break;
        case KEY_CODES.enter:
            handleOptionClick(e);
            break;
        case KEY_CODES.escape:
            activeInput.focus();
            hidePopup();
            break;
        default:
            break;
    }
};

const linkOptionEvents = (data) => {
    let suggestions = document.querySelectorAll(`li[class='popupItem']`);
    suggestions.forEach((suggestion) => {
        suggestion.addEventListener('click', handleOptionClick);
        suggestion.addEventListener('keydown', handleOptionKeyDown(data));
    });
};

const setActiveInput = (input) => (activeInput = input);

const focusOnPopup = () => popupShown && popup.firstChild.focus();

const positionPopup = () => {
    const rect = activeInput.getBoundingClientRect();
    const paddingBottom = +getComputedStyle(activeInput).paddingBottom.replace('px', '');
    const paddingLeft = +getComputedStyle(activeInput).paddingLeft.replace('px', '');
    popup.style.top = `${rect.bottom - paddingBottom}px`;
    popup.style.left = `${rect.left + paddingLeft}px`;
};

const showPopup = () => {
    popup.style.display = 'flex';
    popupShown = true;
};

const hidePopup = () => {
    popup.style.display = 'none';
    popupShown = false;
};

const renderPopup = (data) => {
    if (data.length) {
        renderOptions(data);
        linkOptionEvents(data);
        positionPopup();
        showPopup();
    }
};

const handleInputKeyDown = (e) => {
    switch (e.keyCode) {
        case KEY_CODES.space:
            updatePopup(getLastWord());
            break;
        case KEY_CODES.upArrow:
        case KEY_CODES.downArrow:
            focusOnPopup();
            e.preventDefault();
            break;
        default:
            hidePopup();
            setValueFromEvent(e);
            setActiveInput(e.target);
            break;
    }
};

const wire = (input) => {
    input.onmouseup = handleTextSelection;
    input.onkeyup = handleTextSelection;
    input.addEventListener('keydown', handleInputKeyDown);
};

const wireAll = (inputs) => inputs.forEach((input) => wire(input));

mountPopupElement();

document.addEventListener('click', handleClickOutside);

wireAll(inputs);

setInterval(() => {
    const newInputs = getInputs();
    if (newInputs.length !== inputs.length) {
        const scheme = newInputs.reduce(
            (acc, newInput) => {
                inputs.find((input) => input === newInput)
                    ? acc.actual.push(newInput)
                    : acc.unWired.push(newInput);
                return acc;
            },
            { actual: [], unWired: [] },
        );

        wireAll(scheme.unWired);

        inputs = [...scheme.actual, ...scheme.unWired];
    }
}, 2000);