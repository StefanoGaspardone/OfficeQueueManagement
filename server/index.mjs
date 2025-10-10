import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

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

});

// NEXT CUSTOMER
app.post('/api/counters/:id/tickets', async (req, res) => {
    
});

// GET COUNTER QUEUES
app.get('/api/counters/:id/queues', async (req, res) => {

});

/* RUN THE SERVER */
app.listen(port, () => console.log(`SERVER LISTENING ON http://localhost:${port}`))