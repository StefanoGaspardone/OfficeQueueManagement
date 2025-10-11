const SERVER_URL = 'http://localhost:8080';

const getServices = async () => {
    try {
        const response = await fetch(`${SERVER_URL}/api/services`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.services;   
    } catch (error) {
        console.error('Error fetching services:', error);
        return [];
    }
};

const getTicket = async (serviceType) => {
    try {
        const response = await fetch(`${SERVER_URL}/api/tickets`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ serviceType }),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Ticket created with ID:', data.ticketId);
        return data.ticketId;
    } catch (error) {
        console.error('Error creating ticket:', error);
        return null;
    }
};


const API = { getServices, getTicket };
export default API;