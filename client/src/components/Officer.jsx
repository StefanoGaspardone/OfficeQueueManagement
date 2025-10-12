import { useState, useEffect } from 'react';

export default function OfficerPage() {
    const [counters, setCounters] = useState([]);
    const [selectedCounter, setSelectedCounter] = useState(null);
    const [queues, setQueues] = useState(null);

    useEffect(() => {
        fetch('/api/counters')
            .then(res => res.json())
            .then(data => setCounters(data))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        if (selectedCounter !== null) {
            fetch(`/api/counters/${selectedCounter}/queues`)
                .then(res => res.json())
                .then(data => setQueues(data))
                .catch(err => console.error(err));
        }
    }, [selectedCounter]);

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
                        <div key={service} style={{ marginBottom: '1rem' }}>
                            <strong>{service}</strong>
                            <ul>
                                {tickets.map(ticketId => (
                                    <li key={ticketId}>{ticketId}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
