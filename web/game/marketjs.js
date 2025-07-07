
const listeners = [];

function addevent(element, event, handler) {
    element.addEventListener(event, handler);
    listeners.push({ element, event, handler });
}

function endevent() {
    for (const { element, event, handler } of listeners) {
        element.removeEventListener(event, handler);
    }
    listeners.length = 0;
}
