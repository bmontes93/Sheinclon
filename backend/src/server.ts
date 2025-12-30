import app from './app';
import connectDB from './config/db';

const startServer = async () => {
  await connectDB();

  const PORT = process.env.PORT || 5000;

  const server = app.listen(PORT, () => {
    if (process.env.NODE_ENV !== 'test') {
      console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
      console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
    }
  });

  process.on('unhandledRejection', (err: any) => {
    console.log(`Error no manejado: ${err.message}`);
    // server.close(() => process.exit(1)); // Optional: close gracefully
  });
};

startServer();
