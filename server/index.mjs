import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

/* INIT */
const app = express();
const port = 3000;

/* MIDDLEWARES */
app.use(express.json());
app.use(morgan('dev'));
app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true,
}));

/* APIs */


/* RUN THE SERVER */
app.listen(port, () => console.log(`SERVER LISTENING ON http://localhost:${port}`))