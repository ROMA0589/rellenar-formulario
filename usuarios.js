// Base de usuarios
const users = [
    {
        username: 'conferente',
        password: 'move2024',
        role: 'conferente',
        fullName: 'Conferente',
        email: 'conferente@empresa.com'
    }
];

// Guardar usuarios en localStorage
if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(users));
}

// Función para validar usuario
function validateUser(username, password) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.find(u => u.username === username && u.password === password);
}

// Función para obtener todos los usuarios (solo admin)
function getAllUsers() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    if (currentUser.role !== 'admin') {
        return [];
    }
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.map(({ password, ...user }) => user); // Excluir contraseñas
}
