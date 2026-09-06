import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { run, get, query } from './database.js';

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_change_in_prod';

app.use(cors());
app.use(express.json());

// Middleware de Autenticação
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Acesso negado' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = user;
    next();
  });
};

// ==========================================
// ROTAS DE AUTENTICAÇÃO
// ==========================================
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Preencha todos os campos' });

  try {
    const existingUser = await get(`SELECT * FROM users WHERE email = ?`, [email]);
    if (existingUser) return res.status(400).json({ error: 'Email já cadastrado' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await run(`INSERT INTO users (name, email, password) VALUES (?, ?, ?)`, [name, email, hashedPassword]);
    
    const token = jwt.sign({ id: result.lastID, name }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: result.lastID, name, email } });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await get(`SELECT * FROM users WHERE email = ?`, [email]);
    if (!user) return res.status(400).json({ error: 'Usuário não encontrado' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Senha incorreta' });

    const token = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

// ==========================================
// ROTAS DE TAREFAS
// ==========================================

// Criar Tarefa
app.post('/api/tasks', authenticateToken, async (req, res) => {
  const { title, description, due_date, priority, category } = req.body;
  try {
    const result = await run(
      `INSERT INTO tasks (user_id, title, description, due_date, priority, category) VALUES (?, ?, ?, ?, ?, ?)`,
      [req.user.id, title, description, due_date, priority || 'Media', category || 'Outros']
    );
    const newTask = await get(`SELECT * FROM tasks WHERE id = ?`, [result.lastID]);
    res.json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar tarefa' });
  }
});

// Listar Tarefas
app.get('/api/tasks', authenticateToken, async (req, res) => {
  try {
    const tasks = await query(`SELECT * FROM tasks WHERE user_id = ? ORDER BY due_date ASC`, [req.user.id]);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar tarefas' });
  }
});

// Atualizar Status da Tarefa
app.patch('/api/tasks/:id', authenticateToken, async (req, res) => {
  const { status } = req.body;
  try {
    await run(`UPDATE tasks SET status = ? WHERE id = ? AND user_id = ?`, [status, req.params.id, req.user.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar tarefa' });
  }
});

// Deletar Tarefa
app.delete('/api/tasks/:id', authenticateToken, async (req, res) => {
  try {
    await run(`DELETE FROM tasks WHERE id = ? AND user_id = ?`, [req.params.id, req.user.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir tarefa' });
  }
});

// ==========================================
// ROTA DO DASHBOARD
// ==========================================
app.get('/api/dashboard', authenticateToken, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
    
    const totalResult = await get(`SELECT COUNT(*) as count FROM tasks WHERE user_id = ?`, [req.user.id]);
    
    const completedTodayResult = await get(
      `SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND status = 'concluida' AND due_date = ?`, 
      [req.user.id, today]
    );
    
    // Atrasadas: pendentes com data limite menor que hoje (e não vazia)
    const overdueResult = await get(
      `SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND status = 'pendente' AND due_date < ? AND due_date != ''`, 
      [req.user.id, today]
    );

    res.json({
      total: totalResult.count,
      completedToday: completedTodayResult.count,
      overdue: overdueResult.count
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao carregar dados do painel' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
});
