import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { State } from './entity/State';
import { City } from './entity/City';
import dotenv from 'dotenv';
import { Address } from './entity/Address';
import { Contact } from './entity/Contact';
import { IndividualPerson } from './entity/IndividualPerson';
import { EnterprisePerson } from './entity/EnterprisePerson';
import { Person } from './entity/Person';
import { Employee } from './entity/Employee';
import { Level } from './entity/Level';
import { Parameterization } from './entity/Parameterization';
import { Client } from './entity/Client';
import { BankData } from './entity/BankData';
import { Driver } from './entity/Driver';
import { Proprietary } from './entity/Proprietary';
import { TruckType } from './entity/TruckType';
import { Truck } from './entity/Truck';
import { Representation } from './entity/Representation';
import { Product } from './entity/Product';
import { PaymentForm } from './entity/PaymentForm';
import { BillPayCategory } from './entity/BillPayCategory';
import { SaleBudget } from './entity/SaleBudget';
import { SaleItem } from './entity/SaleItem';
import { FreightBudget } from './entity/FreightBudget';
import { FreightItem } from './entity/FreightItem';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: 3306,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_SCHEMA,
  synchronize: true,
  logging: true,
  entities: [
    State,
    City,
    Address,
    Contact,
    IndividualPerson,
    EnterprisePerson,
    Person,
    Level,
    Employee,
    Parameterization,
    Client,
    BankData,
    Driver,
    Proprietary,
    TruckType,
    Truck,
    Representation,
    Product,
    PaymentForm,
    BillPayCategory,
    SaleItem,
    SaleBudget,
    FreightItem,
    FreightBudget,
  ],
  migrations: [],
  subscribers: [],
});
