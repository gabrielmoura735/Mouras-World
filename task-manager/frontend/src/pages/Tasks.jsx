import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { Plus, Trash2, Edit2 } from 'lucide-react'
import { format } from 'date-fns'

const fetchTasks = async () => {
  // Mock data
  return [
    { id: 1, title: 'Learn React Query', status: 'PENDING', priority: 'HIGH', createdAt: new Date().toISOString() },
    { id: 2, title: 'Setup Express Backend', status: 'COMPLETED', priority: 'MEDIUM', createdAt: new Date().toISOString() }
  ]
  // const { data } = await axios.get('/tasks')
  // return data
}

const Tasks = () => {
  const queryClient = useQueryClient()
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [priority, setPriority] = useState('MEDIUM')

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks
  })

  // Mock mutations for UI logic
  const addTaskMutation = useMutation({
    mutationFn: async (newTask) => {
      // return axios.post('/tasks', newTask)
      return { ...newTask, id: Date.now(), status: 'PENDING', createdAt: new Date().toISOString() }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['tasks'], (old) => [...old, data])
      setNewTaskTitle('')
    }
  })

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, updates }) => {
      // return axios.put(`/tasks/${id}`, updates)
      return { id, ...updates }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['tasks'], (old) => 
        old.map(task => task.id === data.id ? { ...task, ...data } : task)
      )
    }
  })

  const deleteTaskMutation = useMutation({
    mutationFn: async (id) => {
      // return axios.delete(`/tasks/${id}`)
      return id
    },
    onSuccess: (id) => {
      queryClient.setQueryData(['tasks'], (old) => old.filter(task => task.id !== id))
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return
    
    addTaskMutation.mutate({
      title: newTaskTitle,
      priority
    })
  }

  const getPriorityColor = (p) => {
    switch (p) {
      case 'HIGH': return 'var(--danger-color)'
      case 'MEDIUM': return 'var(--warning-color)'
      case 'LOW': return 'var(--success-color)'
      default: return 'var(--text-muted)'
    }
  }

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem' }}>Task Management</h1>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <form onSubmit={handleSubmit} className="flex gap-4 items-center">
          <input 
            type="text" 
            className="input-field" 
            placeholder="What needs to be done?" 
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            style={{ margin: 0, flex: 1 }}
          />
          <select 
            className="input-field" 
            style={{ margin: 0, width: 'auto' }}
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="LOW">Low Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="HIGH">High Priority</option>
          </select>
          <button type="submit" className="btn btn-primary" disabled={addTaskMutation.isPending}>
            <Plus size={18} className="mr-2" style={{ marginRight: '0.5rem' }} />
            Add Task
          </button>
        </form>
      </div>

      {isLoading ? (
        <div className="text-center">Loading tasks...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {tasks.map(task => (
            <div key={task.id} className="card flex items-center justify-between" style={{ padding: '1rem' }}>
              <div className="flex items-center gap-4">
                <input 
                  type="checkbox" 
                  checked={task.status === 'COMPLETED'}
                  onChange={(e) => updateTaskMutation.mutate({ 
                    id: task.id, 
                    updates: { status: e.target.checked ? 'COMPLETED' : 'PENDING' } 
                  })}
                  style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer' }}
                />
                <div>
                  <h3 style={{ 
                    textDecoration: task.status === 'COMPLETED' ? 'line-through' : 'none',
                    color: task.status === 'COMPLETED' ? 'var(--text-muted)' : 'var(--text-main)'
                  }}>
                    {task.title}
                  </h3>
                  <div className="flex gap-4 mt-2" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span style={{ 
                      color: getPriorityColor(task.priority),
                      fontWeight: 'bold',
                      backgroundColor: `${getPriorityColor(task.priority)}15`,
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      {task.priority}
                    </span>
                    <span>Created: {format(new Date(task.createdAt), 'MMM dd, yyyy')}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  className="btn" 
                  style={{ padding: '0.5rem', background: '#fee2e2', color: 'var(--danger-color)' }}
                  onClick={() => deleteTaskMutation.mutate(task.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          
          {tasks.length === 0 && (
            <div className="text-center" style={{ color: 'var(--text-muted)', padding: '2rem' }}>
              No tasks found. Create one above!
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Tasks
