async function login() {
  const login = document.getElementById('login').value;
  const password = document.getElementById('password').value;
  
  try {
    const response = await fetch('http://localhost:5000/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password })
    });

    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem('admin_token', data.token);
      window.location.href = 'panel.html';
    } else {
      document.getElementById('error').textContent = data.error || 'Ошибка входа';
    }
  } catch (err) {
    document.getElementById('error').textContent = 'Ошибка соединения';
  }
}

// Проверка авторизации при загрузке
function checkAuth() {
  const token = localStorage.getItem('admin_token');
  if (!token) return false;

  fetch('http://localhost:5000/api/admin/verify', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(res => res.json())
  .then(data => {
    if (!data.valid) {
      localStorage.removeItem('admin_token');
      window.location.href = 'login.html';
    }
  });
}