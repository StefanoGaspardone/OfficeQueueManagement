import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { getServices, createTicket } from './db/dao.mjs';

/* INIT */
const app = express();
const port = 8080;

/* MIDDLEWARES */
app.use(express.json());
app.use(morgan('dev'));
app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true,
}));

/* APIs */
// GET TICKET
app.post('/api/tickets', async (req, res) => {
    try {
        const { serviceType } = req.body;
        const result = await createTicket(serviceType);
        res.status(201).json({ ticketId: result.ticketId });
    } catch (error) {
        
    }
});

// NEXT CUSTOMER
app.post('/api/counters/:id/tickets', async (req, res) => {
    
});

// GET COUNTER QUEUES
app.get('/api/counters/:id/queues', async (req, res) => {

});

app.get('/api/services', async (req, res) => {
    try {
        const services = await getServices();
        res.status(200).json({ services });
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
        

/* RUN THE SERVER */
app.listen(port, () => console.log(`SERVER LISTENING ON http://localhost:${port}`))