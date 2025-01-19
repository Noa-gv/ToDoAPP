import axios from './axiosConfig';

const service = {
  async getTasks() {
    try {
      const response = await axios.get('/items');
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
  },

  async addTask(newTask) {
    try {
      const response = await axios.post('/items', { name: newTask, isComplete: false });
      return response.data;
    } catch (error) {
      console.error("Error adding task:", error);
    }
  },

  async setCompleted(id, isComplete) {
    try {
      const response = await axios.put(`/items/${id}`, { isComplete });
      return response.data;
    } catch (error) {
      console.error("Error updating task completion:", error);
    }
  },

  async deleteTask(id) {
    try {
      await axios.delete(`/items/${id}`);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  },

  async getUsers() {
    try {
      const response = await axios.get('/users');
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  },

  // פונקציה להוספת משתמש
  async addUser(username, password) {
    try {
      const response = await axios.post('/users', { username, password });
      return response.data;
    } catch (error) {
      console.error("Error adding user:", error);
    }
  },

  // פונקציה לעדכון פרטי משתמש
  async updateUser(id, userDetails) {
    try {
      const response = await axios.put(`/users/${id}`, userDetails);
      return response.data;
    } catch (error) {
      console.error("Error updating user:", error);
    }
  },

  // פונקציה למחיקת משתמש
  async deleteUser(id) {
    try {
      await axios.delete(`/users/${id}`);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  },
  
  async signup(username, password) {
    try {
      const response = await axios.post('/signup', { username, password });
      return response.data;
    } catch (error) {
      console.error("Error during signup:", error);
      throw error;
    }
  },

  async login(username, password) {
    try {
      // בצע בקשת התחברות לשרת
      const response = await axios.post('/login', { username, password });
      // נניח שהשרת מחזיר טוקן, אחסון בטוקן ב-localStorage
      localStorage.setItem('authToken', response.data.token);
    } catch (error) {
      throw new Error('Login failed');
    }
  }
};

export default service;
