import 'reflect-metadata';
import { DataSource } from 'typeorm';
import User from '../models/User';
import Product from '../models/Product';
import Coupon from '../models/Coupon';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  synchronize: true, // Only for dev! Auto-creates tables
  logging: false,
  entities: [User, Product, Coupon],
  subscribers: [],
  migrations: [],
});

const connectDB = async () => {
  try {
    await AppDataSource.initialize();
    console.log('📦 SQLite Data Source has been initialized!');
  } catch (err) {
    console.error('Error during Data Source initialization:', err);
    process.exit(1);
  }
};

export default connectDB;
