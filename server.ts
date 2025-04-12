import app from './app.js';
import { initializeDatabase } from './src/config/database.js';

const startServer = async () => {
  try {
    await initializeDatabase();
    
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  } catch (error) {
    console.error("Erro ao iniciar o servidor:", error);
    process.exit(1);
  }
};

startServer();