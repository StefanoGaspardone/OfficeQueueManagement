import { useEffect, useState } from "react";
import API from "../API/API.mjs";
import './Customer.css';
import InfoDisplay from "./InfoDisplay";

function CustomerPage() {
  const [services, setServices] = useState([]); // array containing objects of type {id: integer, type: string} (null if no services available)
  const [selectedService, setSelectedService] = useState(null); // id of the selected service (null if no service is selected yet)
  const [ticketId, setTicketId] = useState(null); // id of the requested ticket (null if no ticket has been requested yet) 

  useEffect(() => {
    API.getServices().then((data) => {
      setServices(Array.isArray(data) ? data : []);
    });
  }, []);

  return (
    <div className="customer-container">
      <h2>Customer Page</h2>

      {ticketId !== null && (
        <div className="ticket-card">Your ticket ID is: {ticketId}</div>
      )}
      <InfoDisplay ticketId={ticketId}/>
      <p>Please select a service:</p>

      <div role="list" className="services-grid">
        {services.map((service) => (
          <button
            key={service.id}
            type="button"
            onClick={() => setSelectedService(service.id)}
            aria-pressed={selectedService === service.id}
            className={`service-button ${selectedService === service.id ? 'selected' : ''}`}
          >
            {service.type}
          </button>
        ))}
      </div>

      <div className="get-ticket-row">
        <button
          type="button"
          className="get-ticket-button"
          disabled={!selectedService}
          onClick={() => {
            API.getTicket(selectedService).then((ticketId) => {
              setTicketId(ticketId);
            });
          }}
        >
          Get Ticket
        </button>
      </div>
    </div>
  );
}

export default CustomerPage;
