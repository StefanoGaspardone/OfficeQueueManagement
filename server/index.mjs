import express from 'express';
<<<<<<< HEAD

const app = new express();
const port = 3001;

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
=======
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
>>>>>>> a2e57f28b859862c64b7e035fc7e6f06f56131a9
