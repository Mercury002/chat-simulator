export function sendMessage(message) {
    const chatMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    chatMessages.push(message);
    localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
    // Trigger the storage event
    localStorage.setItem('chatUpdate', Date.now().toString());
}

export function getMessages() {
    return JSON.parse(localStorage.getItem('chatMessages')) || [];
}