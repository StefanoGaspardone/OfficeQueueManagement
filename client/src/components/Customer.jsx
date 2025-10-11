import { useState } from 'react';

function CustomerPage() {
    // Example services array — its length can change over time
    const [services] = useState([
        'General Inquiry',
        'Payments',
        'Technical Support',
        'Appointments',
        'Returns',
        'Info Desk',
        'Complaints',
        'Other'
    ]);

    const [selectedService, setSelectedService] = useState(null);

    return (
        <div style={{ padding: 16 }}>
            <h2>Customer Page</h2>

            <p>Please select a service:</p>

            <div
                role="list"
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: 8,
                    marginBottom: 16,
                }}
            >
                {services.map((service, idx) => (
                    <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedService(service)}
                        aria-pressed={selectedService === service}
                        style={{
                            padding: 12,
                            borderRadius: 6,
                            border: selectedService === service ? '2px solid #0b5fff' : '1px solid #ccc',
                            backgroundColor: selectedService === service ? '#e6f0ff' : '#fff',
                            cursor: 'pointer',
                            textAlign: 'center',
                        }}
                    >
                        {service}
                    </button>
                ))}
            </div>

            <div>
                <button
                    type="button"
                    disabled={!selectedService}
                    onClick={() => {
                        // Placeholder action — replace with real API call
                        alert(`Ticket requested for: ${selectedService}`);
                    }}
                    style={{
                        padding: '10px 16px',
                        backgroundColor: selectedService ? '#0b5fff' : '#cfcfcf',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 6,
                        cursor: selectedService ? 'pointer' : 'not-allowed',
                    }}
                >
                    Get Ticket
                </button>
            </div>
        </div>
    );
}

export default CustomerPage;
