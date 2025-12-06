import api from './api';

export const taskService = {
  // Create a new task
  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  // Get all tasks for current user's household
  getAllTasks: async () => {
    const response = await api.get('/tasks');
    return response.data;
  },

  // Get task by ID
  getTaskById: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  // Update task
  updateTask: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  // Delete task
  deleteTask: async (id) => {
    await api.delete(`/tasks/${id}`);
  },

  // Toggle task completion
  toggleTaskCompletion: async (id) => {
    const response = await api.post(`/tasks/${id}/toggle`);
    return response.data;
  },
};
