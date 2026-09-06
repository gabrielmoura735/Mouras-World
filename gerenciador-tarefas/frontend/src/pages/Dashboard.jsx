import { useState, useEffect } from 'react';
import api from '../api';
import useStore from '../store';
import StatsCard from '../components/StatsCard';
import { ListTodo, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useStore();
  const [stats, setStats] = useState({ total: 0, completedToday: 0, overdue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/dashboard');
        setStats(response.data);
      } catch (err) {
        console.error("Erro ao carregar dados do dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900">Olá, {user?.name}! 👋</h1>
      <p className="mt-1 text-sm text-gray-500">
        Aqui está o seu resumo de produtividade hoje.
      </p>

      {loading ? (
        <div className="mt-8 text-center text-gray-500">Carregando painel...</div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <StatsCard 
            title="Total de Tarefas" 
            stat={stats.total} 
            icon={ListTodo} 
            colorClass="bg-indigo-500" 
          />
          <StatsCard 
            title="Feitas Hoje" 
            stat={stats.completedToday} 
            icon={CheckCircle} 
            colorClass="bg-green-500" 
          />
          <StatsCard 
            title="Atrasadas" 
            stat={stats.overdue} 
            icon={AlertCircle} 
            colorClass="bg-red-500" 
          />
        </div>
      )}

      <div className="mt-12 bg-white shadow rounded-lg border border-gray-100 p-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Pronto para ser produtivo?</h3>
          <p className="text-gray-500 mt-1">Organize seu dia criando novas tarefas na aba de Tarefas.</p>
        </div>
        <Link 
          to="/tasks"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Ir para Tarefas
        </Link>
      </div>
    </div>
  );
}
