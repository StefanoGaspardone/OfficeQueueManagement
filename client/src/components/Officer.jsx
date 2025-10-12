import { useState, useEffect } from 'react';
import API from '../API/API.mjs';
import './Officer.css';

export default function OfficerPage() {
    const [counters, setCounters] = useState([]);
    const [selectedCounter, setSelectedCounter] = useState(null);
    const [queues, setQueues] = useState(null);

    useEffect(() => {
        API.getCounters()
            .then(data => setCounters(data))
            .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        if(selectedCounter !== null) getCounterQueues();
    }, [selectedCounter]);

    const getCounterQueues = () => {
        API.getCounterQueues(selectedCounter)
            .then(data => setQueues(data))
            .catch(err => console.log(err));
    }

    const nextCustomer = () => {
        if(!selectedCounter) return;

        API.nextCustomer(selectedCounter)
            .then(data => getCounterQueues())
            .catch(err => console.log(err));
    }

    return (
        <div style={{ padding: '1rem' }}>
            <h2>Officer Page</h2>

            <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="counterSelect">Select Counter: </label>
                <select
                    id="counterSelect"
                    value={selectedCounter || ''}
                    onChange={e => setSelectedCounter(e.target.value)}
                >
                    <option value="" disabled>Select a counter</option>
                    {counters.map(id => (
                        <option key={id} value={id}>
                            Counter {id}
                        </option>
                    ))}
                </select>
            </div>
            {queues && (
                <div>
                    <h3>Queues for Counter {selectedCounter}</h3>
                    {Object.entries(queues).map(([service, tickets]) => (
                        <div key = { service } style = {{ marginBottom: '1rem' }}>
                            <strong>{service}</strong>
                            {tickets.length !== 0 ? (
                                <div className = 'tickets-grid'>
                                    {tickets.map(ticket => (
                                        <div key = { ticket.id } className = 'ticket-card'>
                                            <h1 className = 'ticket-id'>{ticket.id}</h1>
                                            <p className = 'ticket-time'>Issued at {ticket.issuetime}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>No queue for this service</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
            {selectedCounter && (
                <button onClick = { nextCustomer } className = 'next-customer-button'>Call next customer</button>
            )}
        </div>
    );
}
