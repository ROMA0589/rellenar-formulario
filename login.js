// Usuarios autorizados
const authorizedUsers = [
    { username: 'admin', password: 'admin2024', role: 'admin', fullName: 'Administrador' },
    { username: 'conferente', password: 'move2024A', role: 'conferente', fullName: 'Conferente A' },
    { username: 'conferente', password: 'move2024B', role: 'conferente', fullName: 'Conferente B' },
    { username: 'conferente', password: 'move2024C', role: 'conferente', fullName: 'Conferente C' },
    { username: 'conferente', password: 'move2024D', role: 'conferente', fullName: 'Conferente D' },
    { username: 'conferente', password: 'move2024E', role: 'conferente', fullName: 'Conferente E' },
    { username: 'conferente', password: 'move2024F', role: 'conferente', fullName: 'Conferente F' },
    { username: 'conferente', password: 'move2024G', role: 'conferente', fullName: 'Conferente G' },
    { username: 'conferente', password: 'move2024H', role: 'conferente', fullName: 'Conferente H' },
    { username: 'conferente', password: 'move2024I', role: 'conferente', fullName: 'Conferente I' },
    { username: 'conferente', password: 'move2024J', role: 'conferente', fullName: 'Conferente J' }
];

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = this.username.value;
    const password = this.password.value;
    
    const user = authorizedUsers.find(u => 
        u.username === username && u.password === password
    );
    
    if (user) {
        sessionStorage.setItem('currentUser', JSON.stringify({
            username: user.username,
            role: user.role,
            
            fullName: user.fullName,
            lastLogin: new Date().toISOString()
        }));
        
        showUserInfo(user);
        setTimeout(() => {
            if (user.role === 'admin') {
                window.location.href = 'registros.html'; // Admin va a los registros
            } else {
                window.location.href = 'index.html'; // Conferentes van al formulario
            }
        }, 1500);
    } else {
        alert('Usuário ou senha incorretos.\nVerifique suas credenciais e tente novamente.');
    }
});

function showUserInfo(user) {
    const roleColors = {
        admin: 'danger',
        conferente: 'success'
    };
    
    const roleNames = {
        admin: 'Administrador',
        conferente: 'Conferente'
    };

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${roleColors[user.role]} text-center`;
    alertDiv.innerHTML = `
        <strong>Bem-vindo!</strong><br>
        ${user.fullName}<br>
        <span class="badge bg-${roleColors[user.role]}">${roleNames[user.role]}</span>
    `;
    
    document.querySelector('.container').appendChild(alertDiv);
}
