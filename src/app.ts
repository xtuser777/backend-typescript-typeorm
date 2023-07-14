import dotenv from 'dotenv';

dotenv.config();

import 'reflect-metadata';
import express from 'express';
import crypt from './routes/crypt';
import city from './routes/city';
import state from './routes/state';
import token from './routes/token';
import level from './routes/level';
import employee from './routes/employee';
import parameterization from './routes/parameterization';
import client from './routes/client';
import driver from './routes/driver';
import proprietary from './routes/proprietary';
import type from './routes/truck-type';
import truck from './routes/truck';
import representation from './routes/representation';
import product from './routes/product';
import paymentForm from './routes/payment-form';
import billPayCategory from './routes/bill-pay-category';
import saleBudget from './routes/sale-budget';
import freightBudget from './routes/freight-budget';
import saleOrder from './routes/sale-order';
import freightOrder from './routes/freight-order';
import billPay from './routes/bill-pay';
import receiveBill from './routes/receive-bill';
import event from './routes/event';
import status from './routes/status';
import orderStatus from './routes/order-status';
import report from './routes/report';
import loadStep from './routes/load-step';
import cors from 'cors';
import { AppDataSource } from './data-source';
import { resolve } from 'path';

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
    this.app.use('/reports/', express.static(resolve(__dirname, '..', 'reports')));
  }

  private routes() {
    this.app.use('/crypt', crypt);
    this.app.use('/state', state);
    this.app.use('/city', city);
    this.app.use('/token', token);
    this.app.use('/employee', employee);
    this.app.use('/level', level);
    this.app.use('/parameterization', parameterization);
    this.app.use('/client', client);
    this.app.use('/driver', driver);
    this.app.use('/proprietary', proprietary);
    this.app.use('/type', type);
    this.app.use('/truck', truck);
    this.app.use('/representation', representation);
    this.app.use('/product', product);
    this.app.use('/payment-form', paymentForm);
    this.app.use('/bill-pay-category', billPayCategory);
    this.app.use('/sale-budget', saleBudget);
    this.app.use('/freight-budget', freightBudget);
    this.app.use('/sale-order', saleOrder);
    this.app.use('/freight-order', freightOrder);
    this.app.use('/bill-pay', billPay);
    this.app.use('/receive-bill', receiveBill);
    this.app.use('/event', event);
    this.app.use('/status', status);
    this.app.use('/order-status', orderStatus);
    this.app.use('/load-step', loadStep);
    this.app.use('/report', report);
  }
}

export default App;
