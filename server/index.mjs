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


/* RUN THE SERVER */
app.listen(port, () => console.log(`SERVER LISTENING ON http://localhost:${port}`))