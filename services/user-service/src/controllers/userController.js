// Simple user controller with mock data
const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
  ];
  
  exports.getAllUsers = (req, res) => {
    // Add artificial delay to simulate processing
    setTimeout(() => {
      res.json(users);
    }, Math.random() * 100);
  };
  
  exports.getUserById = (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(u => u.id === id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Occasionally generate errors for testing
    if (Math.random() > 0.8) {
      return res.status(500).json({ error: 'Random error occurred' });
    }
    
    res.json(user);
  };
  
  exports.createUser = (req, res) => {
    const { name, email } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    
    const newUser = {
      id: users.length + 1,
      name,
      email
    };
    
    users.push(newUser);
    res.status(201).json(newUser);
  };