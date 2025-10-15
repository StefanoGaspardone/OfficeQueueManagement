import API from "../API/API.mjs";
import { io } from "socket.io-client";
import { useEffect, useState, useRef } from "react";
import "./InfoDisplay.css"; // Import the new CSS file

export default function InfoDisplay({ ticketId }) {
  const [socket, setSocket] = useState(null);
  const [counters, setCounters] = useState([]);
  const [waitingTickets, setWaitingTickets] = useState([]);
  const [servedTicket, setServedTicket] = useState(null);
  const [called, setCalled] = useState(false);
  const [counterCalledBy, setCounterCalledBy] = useState(null);
  const waitingTicketsRef = useRef(waitingTickets);
  const counterCalledByRef = useRef(counterCalledBy);
  const ticketIdRef = useRef(ticketId);
  const countersRef = useRef(counters);

  // Fetch counters and waiting tickets on component mount
  useEffect(() => {
    API.getCounters().then((counterIds) => {
      let res;
      if (Array.isArray(counterIds)) {
        res = counterIds.map((counterId) => ({
          counterId: counterId,
          lastTicketCalled: null,
        }));
      } else {
        res = [];
      }
      setCounters(res);
    });
    API.getWaitingTickets().then((data) => {
      if (ticketId && !data.includes(ticketId)) {
        data.push(ticketId);
      }
      setWaitingTickets(Array.isArray(data) ? data : []);
    });
  }, [ticketId]);

  useEffect(() => {
    waitingTicketsRef.current = waitingTickets;
  }, [waitingTickets]);
  useEffect(() => {
    ticketIdRef.current = ticketId;
  }, [ticketId]);
  useEffect(() => {
    countersRef.current = counters;
  }, [counters]);
  useEffect(() => {
    counterCalledByRef.current = counterCalledBy;
  }, [counterCalledBy]);

  useEffect(() => {
    // Initialize socket
    const newSocket = io("http://localhost:8080");
    setSocket(newSocket);

    // Event listeners
    newSocket.on("ticketServed", (data) => {
      if (!waitingTicketsRef.current.includes(data.ticketId)) {
        console.log(
          "Error: a ticket not in the queue has been called, ticket called is:",
          data.ticketId,
          "the queue is:",
          waitingTickets
        );
      } else {
        setWaitingTickets((prevTickets) =>
          prevTickets.filter((id) => id !== data.ticketId)
        );
        setCounters((prevCounters) =>
          prevCounters.map((counter) => {
            if (counter.counterId === data.counterId) {
              return { ...counter, lastTicketCalled: data.ticketId };
            } else {
              return counter;
            }
          })
        );
      }
      console.log("received : " + JSON.stringify(data));
      console.log("ticketIdRef.current = " + ticketIdRef.current);
      console.log("counterCalledBy = " + JSON.stringify(counterCalledByRef));
      setServedTicket(data);
      if (data.ticketId === ticketIdRef.current && data.ticketId !== null && ticketIdRef.current !== null) {
        setCalled(true);
        setCounterCalledBy(data.counterId);
      } else {
        setCounters((prevCounters) =>
          prevCounters.map((counter) => {
            if (counter.counterId === data.counterId) {
              return { ...counter, lastTicketCalled: data.ticketId };
            } else {
              return counter;
            }
          })
        );
        if(counterCalledByRef.current === data.counterId && data.counterId !== null ){
            setCalled(false);
        }
      }
    });

    newSocket.on("newTicket", (data) => {
      if (waitingTicketsRef.current.includes(data.ticketId)) {
        console.log(
          "Error: a ticket has been created but was already in the queue, ticket created is:",
          data.ticketId,
          "the queue is:",
          waitingTicketsRef.current
        );
      } else {
        setWaitingTickets((prevTickets) => [...prevTickets, data.ticketId]);
      }
    });

    // Cleanup on component unmount
    return () => {
      newSocket.off("ticketServed");
      newSocket.off("newTicket");
      newSocket.close();
    };
  }, []);

  return (
    <div className="info-display-container">
      {called && (
        <div className="called-ticket-message">
          <h2>
            Your ticket {ticketId} is being served at counter {counterCalledBy}
          </h2>
        </div>
      )}
      {servedTicket && servedTicket.ticketId !== null && (
        <p className="last-served-info">
          Last ticket served: {servedTicket.ticketId} by counter{" "}
          {servedTicket.counterId}
        </p>
      )}
      <div className="counters-section">
        <h3>Active Counters Today:</h3>
        <div className="counters-grid">
          {counters.map((counter) => (
            <div key={counter.counterId} className="counter-info-box">
              <p>Counter {counter.counterId}</p>
              <p>
                {counter.lastTicketCalled
                  ? `Serving: ${counter.lastTicketCalled}`
                  : "Available"}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="waiting-tickets-section">
        <h3>Waiting Tickets:</h3>
        <div className="waiting-tickets-list">
          <p>
            {waitingTickets.length > 0
              ? waitingTickets.join(", ")
              : "No waiting tickets"}
          </p>
        </div>
      </div>
    </div>
  );
}
