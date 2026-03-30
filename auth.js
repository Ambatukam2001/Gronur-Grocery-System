document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  // Unified Serverless Auth State
  const getUsers = () => JSON.parse(localStorage.getItem('users')) || [];
  const setUsers = (users) => localStorage.setItem('users', JSON.stringify(users));

  // 🚪 Registration Handler
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const uname = document.getElementById('uname').value;
      const psw = document.getElementById('psw').value;
      const confirmPsw = document.getElementById('confirm-psw').value;

      if (psw !== confirmPsw) return alert('Passwords do not match!');

      const users = getUsers();
      if (users.some(u => u.username === uname)) return alert('Username already exists!');

      users.push({ username: uname, password: psw });
      setUsers(users);
      alert('Registration successful! Please sign in.');
      window.location.href = 'login.html';
    });
  }

  // 🔑 Login Handler
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const uname = document.getElementById('uname').value;
      const psw = document.getElementById('psw').value;

      const users = getUsers();
      const user = users.find(u => u.username === uname && u.password === psw);

      if (user) {
        localStorage.setItem('currentUser', uname);
        window.location.href = 'index.html';
      } else {
        alert('Invalid username or password.');
      }
    });
  }
});
