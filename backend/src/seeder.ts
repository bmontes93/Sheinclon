import { AppDataSource } from './config/db';
import Product from './models/Product';
// Usamos require para data/products.js si no es un módulo ES, o lo migramos.
// Si products.js exporta con module.exports, necesitamos importarlo via require o cambiarlo.
// Asumiremos que products.js es CommonJS por la extensión .js.
const products = require('../data/products');

const seedData = async () => {
    try {
        await AppDataSource.initialize();
        console.log('📦 Data Source initialized for seeding');

        // Limpiar productos existentes
        await Product.clear();
        console.log('🧹 Old data cleared');

        // Insertar nuevos
        // Necesitamos mapear si los campos difieren, pero asumimos compatibilidad por ahora.
        // El modelo Product tiene campos mandatory.
        
        for (const productData of products) {
            const product = Product.create(productData);
            await product.save();
        }

        console.log('🌱 Data imported successfully');
        process.exit();
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
