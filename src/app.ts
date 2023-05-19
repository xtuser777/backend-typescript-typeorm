import dotenv from 'dotenv';

dotenv.config();

import 'reflect-metadata';
import express from 'express';
import city from './routes/city';
import state from './routes/state';
import token from './routes/token';
import level from './routes/level';
import employee from './routes/employee';
import cors from 'cors';
import { AppDataSource } from './data-source';

const whiteList = ['http://localhost:3000'];

const options: cors.CorsOptions = {
  origin: whiteList,
};

class App {
  private app: express.Express;

  constructor() {
    AppDataSource.initialize()
      .then(async () => {
        /** */
      })
      .catch((error) => {
        console.log(error);
        return;
      });
    this.app = express();
    this.middlewares();
    this.routes();
  }

  listen = (port: number): void => {
    this.app.listen(port, 'localhost');
  };

  private middlewares() {
    this.app.use(cors(options));
    // this.app.use(Helmet());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    //this.app.use(express.static(resolve(__dirname, 'uploads')));
  }

  private routes() {
    this.app.use('/state', state);
    this.app.use('/city', city);
    this.app.use('/token', token);
    this.app.use('/employee', employee);
    this.app.use('/level', level);
  }
}

export default App;
