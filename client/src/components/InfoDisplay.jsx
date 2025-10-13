import API from "../API/API.mjs";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { useRef } from "react";

export default function InfoDisplay({ticketId}) {
    const [socket, setSocket] = useState(null);
    const [counters, setCounters] = useState([]);
    const [waitingTickets, setWaitingTickets] = useState([]);
    const [servedTicket, setServedTicket] = useState(null);
    const [called, setCalled] = useState(false);
    const [counterCalledBy, setCounterCalledBy] = useState(null);
    const waitingTicketsRef = useRef(waitingTickets);
    const ticketIdRef = useRef(ticketId);
    const countersRef = useRef(counters);

    // Recupera i counters e i ticket in attesa quando il componente viene montato
    useEffect(() => {
        API.getCounters().then((counterIds) => {
            let res;
            if (Array.isArray(counterIds)) {
                res = counterIds.map((counterId) => {return {"counterId":counterId, "lastTicketCalled": null}});
            }else {
                res = [];
            }
            setCounters(res);
        });
        API.getWaitingTickets().then((data) => {
            if (!data.includes(ticketId)){
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
    }, []);

    useEffect(() => {
        // Inizializza il socket
        const newSocket = io("http://localhost:8080");
        setSocket(newSocket);

        // Configura gli event listener
        newSocket.on("ticketServed", (data) => {
            if(!waitingTicketsRef.current.includes(data.ticketId)){
                console.log("Error: a ticket not in the queue has been called, ticket called is:", data.ticketId, "the queue is:", waitingTickets);
            }else {
                setWaitingTickets((prevTickets) => prevTickets.filter((id) => id !== data.ticketId));
                setCounters((prevCounters) => prevCounters.map((counter) => {
                    if(counter.counterId === data.counterId){
                        return {...counter, lastTicketCalled: data.ticketId};
                    }else {
                        return counter;
                    }
                }));
            }
            setServedTicket(data);
            if(data.ticketId === ticketIdRef.current){
                setCalled(true);
                setCounterCalledBy(data.counterId);
            }
        });

        newSocket.on("newTicket", (data) => {
            if(waitingTicketsRef.current.includes(data.ticketId)){
                console.log("Error: a ticket has been created but was already in the queue, ticket created is:", data.ticketId, "the queue is:", waitingTickets);
            }else {
                setWaitingTickets((prevTickets) => [...prevTickets, data.ticketId]);
            }
        })
        // Cleanup quando il componente viene smontato
        return () => {
            newSocket.off("ticketServed");
            newSocket.close();
        };
    }, []);

    return (
        <div className="info-display">
            {called ? <div>
                <h2>Your ticket {ticketId} is being served at counter {counterCalledBy}</h2>
            </div>: <></>}
            {servedTicket ? <div>
                    <h3>Last ticket served {servedTicket.ticketId} by counter {servedTicket.counterId} </h3>
                </div>
                : <></>}
            <h3>Active counters today:</h3>
            {counters.map((counter) => (
            <div key={counter.counterId} className="counter-info">
                <p>Counter {counter.counterId} - {counter.lastTicketCalled ? "is serving "+counter.lastTicketCalled: ""}</p>
            </div>
            ))}
            <h3>Waiting Tickets:</h3>
            <p>{waitingTickets.length > 0 ? waitingTickets.join(', ') : 'No waiting tickets'}</p>
            <p>{}</p>
        </div>
    );
}