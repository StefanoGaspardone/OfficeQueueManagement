import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { getServices, createTicket, getCounter, getCounterServices, getTicketServedByCounter, setTicketFinished, updateServiceTime, setTicketServed, getNextCustomer, getServiceQueue, getServiceType} from './db/dao.mjs';

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
        const { serviceId } = req.body;
        if (typeof serviceId !== 'number') {
            return res.status(400).json({ error: 'serviceId (integer) is required in request body' });
        }
        const result = await createTicket(serviceId);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error creating ticket:', error);
        if (error.message && error.message.includes('Service not found')) {
            return res.status(404).json({ error: 'Service not found' });
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// NEXT CUSTOMER
app.post('/api/counters/:id/tickets', async (req, res) => {
    try {
        const { counterId } = req.params;

        const counter = await getCounter(counterId);
        if(!counter) return res.status(404).json({ message: `Counter ${counterId} does not exist` });
        // if(!counter.available) return res.status(422).json({ message: `Counter ${counterId} is currently unavailable` }); if we want the the admin can set a counter unavailable

        let ticketId = await getTicketServedByCounter(counterId);
        if(ticketId) {
            const { serviceId, serviceTime } = await setTicketFinished(counterId, ticketId);
            await updateServiceTime(serviceId, serviceTime);
        }

        ticketId = await getNextCustomer(counterId);
        await setTicketServed(counterId, ticketId);

        return res.status(201).json({ ticketId });
    } catch(error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
});

// GET COUNTER QUEUES
app.get('/api/counters/:id/queues', async (req, res) => {
    try {
        const { counterId } = req.params;
        const counter = await getCounter(counterId);
        if(!counter) return res.status(404).json({ message: `Counter ${counterId} does not exist` });
        // if(!counter.available) return res.status(422).json({ message: `Counter ${counterId} is currently unavailable` }); if we want the the admin can set a counter unavailable

        let counterServices = await getCounterServices(counterId);
        let result = {};
        for(const service of counterServices) {
            const serviceQueue = await getServiceQueue(service);
            const serviceType = await getServiceType(service);
            result[serviceType] = serviceQueue;
        }
            //result will be a JSON object with keys the service types and values arrays of ticket ids
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
});

// GET SERVICES
app.get('/api/services', async (req, res) => {
    try {
        const services = await getServices();
        res.status(200).json({ services });
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Serve swagger.json and Swagger UI
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const swaggerPath = path.join(__dirname, 'swagger.json');
let swaggerSpec = {};
try {
    const raw = fs.readFileSync(swaggerPath, 'utf8');
    swaggerSpec = JSON.parse(raw);
    console.log('Loaded swagger spec from', swaggerPath);
} catch (err) {
    console.warn('Could not read swagger.json at', swaggerPath, '-', err.message);
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/swagger.json', (req, res) => res.json(swaggerSpec));
        

/* RUN THE SERVER */
app.listen(port, () => console.log(`SERVER LISTENING ON http://localhost:${port}`))