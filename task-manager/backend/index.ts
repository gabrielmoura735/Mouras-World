import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-for-dev';

// Middleware para verificar token
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Token não fornecido' });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = user;
    next();
  });
};

// --- ROTAS DE AUTENTICAÇÃO ---

app.post('/api/auth/register', async (req: any, res: any) => {
  try {
    const { name, email, password } = req.body;
    
    // Verifica se usuário existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria usuário
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Gera token
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
});

app.post('/api/auth/login', async (req: any, res: any) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Credenciais inválidas' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

// --- ROTAS DE TASKS ---

app.get('/api/tasks', authenticateToken, async (req: any, res: any) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar tarefas' });
  }
});

app.post('/api/tasks', authenticateToken, async (req: any, res: any) => {
  try {
    const { title, priority, status } = req.body;
    const task = await prisma.task.create({
      data: {
        title,
        priority: priority || 'MEDIUM',
        status: status || 'PENDING',
        userId: req.user.userId,
      },
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar tarefa' });
  }
});

app.put('/api/tasks/:id', authenticateToken, async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { title, priority, status } = req.body;
    
    // Verifica se a task pertence ao usuário
    const existingTask = await prisma.task.findFirst({
      where: { id: Number(id), userId: req.user.userId }
    });

    if (!existingTask) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    const task = await prisma.task.update({
      where: { id: Number(id) },
      data: { title, priority, status },
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar tarefa' });
  }
});

app.delete('/api/tasks/:id', authenticateToken, async (req: any, res: any) => {
  try {
    const { id } = req.params;
    
    const existingTask = await prisma.task.findFirst({
      where: { id: Number(id), userId: req.user.userId }
    });

    if (!existingTask) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    await prisma.task.delete({
      where: { id: Number(id) },
    });
    res.json({ message: 'Tarefa deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar tarefa' });
  }
});

// --- ROTA DE DASHBOARD ---

app.get('/api/dashboard', authenticateToken, async (req: any, res: any) => {
  try {
    const userId = req.user.userId;
    
    const [total, completed, pending, urgent] = await Promise.all([
      prisma.task.count({ where: { userId } }),
      prisma.task.count({ where: { userId, status: 'COMPLETED' } }),
      prisma.task.count({ where: { userId, status: 'PENDING' } }),
      prisma.task.count({ where: { userId, priority: 'HIGH', status: 'PENDING' } }),
    ]);

    res.json({ total, completed, pending, urgent });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar dashboard' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
