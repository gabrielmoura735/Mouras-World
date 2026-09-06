import { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle, Circle, Clock } from 'lucide-react';
import api from '../api';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Media');
  const [category, setCategory] = useState('Trabalho');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/tasks', { title, description, due_date: dueDate, priority, category });
      setTasks([...tasks, res.data]);
      setIsModalOpen(false);
      setTitle('');
      setDescription('');
      setDueDate('');
    } catch (err) {
      console.error(err);
      alert('Erro ao criar tarefa');
    }
  };

  const handleToggleStatus = async (task) => {
    const newStatus = task.status === 'pendente' ? 'concluida' : 'pendente';
    try {
      await api.patch(`/tasks/${task.id}`, { status: newStatus });
      setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Excluir tarefa?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const getPriorityColor = (p) => {
    if (p === 'Alta') return 'bg-red-100 text-red-800';
    if (p === 'Media') return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Suas Tarefas</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" /> Nova Tarefa
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 mt-10">Carregando tarefas...</div>
      ) : tasks.length === 0 ? (
        <div className="text-center bg-white rounded-lg border border-dashed border-gray-300 p-12 mt-4">
          <CheckSquare className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma tarefa</h3>
          <p className="mt-1 text-sm text-gray-500">Comece criando sua primeira tarefa no botão acima.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md flex-1">
          <ul className="divide-y divide-gray-200">
            {tasks.map((task) => (
              <li key={task.id} className={`hover:bg-gray-50 ${task.status === 'concluida' ? 'bg-gray-50 opacity-70' : ''}`}>
                <div className="px-4 py-4 flex items-center sm:px-6">
                  <button 
                    onClick={() => handleToggleStatus(task)}
                    className="mr-4 flex-shrink-0 focus:outline-none"
                  >
                    {task.status === 'concluida' 
                      ? <CheckCircle className="h-6 w-6 text-green-500" /> 
                      : <Circle className="h-6 w-6 text-gray-300 hover:text-indigo-500" />
                    }
                  </button>
                  <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                    <div className="truncate">
                      <div className="flex text-sm">
                        <p className={`font-medium text-indigo-600 truncate ${task.status === 'concluida' ? 'line-through text-gray-500' : ''}`}>{task.title}</p>
                        <span className={`ml-2 flex-shrink-0 inline-block px-2 py-0.5 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className="ml-2 flex-shrink-0 inline-block px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                          {task.category}
                        </span>
                      </div>
                      <div className="mt-2 flex">
                        <div className="flex items-center text-sm text-gray-500">
                          {task.description}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5 flex items-center gap-4">
                      {task.due_date && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          <p>Vence {format(parseISO(task.due_date), "dd 'de' MMM, yyyy", { locale: ptBR })}</p>
                        </div>
                      )}
                      <button 
                        onClick={() => handleDelete(task.id)}
                        className="text-gray-400 hover:text-red-500"
                        title="Excluir"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={() => setIsModalOpen(false)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleCreateTask}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Criar Nova Tarefa</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Título</label>
                      <input type="text" required value={title} onChange={e=>setTitle(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Descrição</label>
                      <textarea value={description} onChange={e=>setDescription(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Data Limite</label>
                        <input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Prioridade</label>
                        <select value={priority} onChange={e=>setPriority(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                          <option value="Baixa">Baixa</option>
                          <option value="Media">Média</option>
                          <option value="Alta">Alta</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Categoria</label>
                      <select value={category} onChange={e=>setCategory(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        <option value="Casa">Casa</option>
                        <option value="Trabalho">Trabalho</option>
                        <option value="Estudos">Estudos</option>
                        <option value="Outros">Outros</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">
                    Salvar Tarefa
                  </button>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
