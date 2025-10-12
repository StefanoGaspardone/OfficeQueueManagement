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

const getTicket = async (serviceId) => {
    try {
        const response = await fetch(`${SERVER_URL}/api/tickets`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ serviceId }),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // server now returns { ticketId, serviceId, serviceType }
        console.log('Ticket created with ID:', data.ticketId);
        return data.ticketId;
    } catch (error) {
        console.error('Error creating ticket:', error);
        return null;
    }
};

const getCounters = async () => {
    try {
        const response = await fetch(`${SERVER_URL}/api/counters`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.counters;   
    } catch (error) {
        console.error('Error fetching counters:', error);
        return [];
    }
};

const getCounterQueues = async (counterId) => {
    try {
        const response = await fetch(`${SERVER_URL}/api/counters/${counterId}/queues`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.queues;   
    } catch (error) {
        console.error('Error fetching queues:', error);
        return [];
    }
}

const nextCustomer = async (counterId) => {
    const response = await  fetch(`${SERVER_URL}/api/counters/${counterId}/tickets`, {
        method: 'POST'
    });
    
    if(!response.ok) throw new Error('Network response was not ok');

    const data = await response.json();
    console.log('Ticket called with ID:', data.ticketId);
    return data.ticketId;
}

const API = { getServices, getTicket, getCounters, getCounterQueues, nextCustomer };
export default API;