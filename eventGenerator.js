const eventTypes = ['USER_LOGIN', 'USER_LOGOUT', 'DATA_UPDATE', 'SYSTEM_ERROR', 'PAYMENT_PROCESSED'];
const applicationIds = ['APP_1', 'APP_2', 'APP_3'];

function generateRandomEvent() {
    return {
        eventType: eventTypes[Math.floor(Math.random() * eventTypes.length)],
        sourceApplicationId: applicationIds[Math.floor(Math.random() * applicationIds.length)],
        dataPayload: {
            userId: Math.floor(Math.random() * 1000),
            action: 'random_action_' + Math.floor(Math.random() * 100),
            status: Math.random() > 0.5 ? 'SUCCESS' : 'FAILURE'
        },
        timestamp: new Date()
    };
}

async function sendEvent() {
    try {
        const event = generateRandomEvent();
        const response = await fetch('http://localhost:3000/api/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(event)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Event sent successfully:', data);
    } catch (error) {
        console.error('Error sending event:', error.message);
    }
}

console.log('Event generator started...');
const intervalId = setInterval(sendEvent, 2000);

// Stop after 2 minutes (120000 milliseconds)
setTimeout(() => {
    clearInterval(intervalId);
    console.log('Event generator stopped after 2 minutes');
}, 120000);