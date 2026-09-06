import { Link, useLocation } from 'react-router-dom';
import { Home, CheckSquare, LogOut } from 'lucide-react';
import useStore from '../store';

export default function Sidebar() {
  const { user, logout } = useStore();
  const location = useLocation();

  const navigation = [
    { name: 'Painel', href: '/', icon: Home },
    { name: 'Tarefas', href: '/tasks', icon: CheckSquare },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <CheckSquare className="h-8 w-8 text-indigo-600" />
        <span className="ml-3 text-lg font-bold text-gray-900">TaskFlow</span>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-3 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon
                  className={`mr-3 flex-shrink-0 h-5 w-5 ${
                    isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div>
            <p className="text-sm font-medium text-gray-900 truncate w-32">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate w-32">{user?.email}</p>
          </div>
          <button 
            onClick={logout}
            className="ml-auto flex items-center p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md"
            title="Sair"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
