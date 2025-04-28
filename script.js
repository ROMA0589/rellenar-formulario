// Verificar autenticación y permisos
const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
if (!currentUser.username || !['admin', 'conferente'].includes(currentUser.role)) {
    window.location.href = 'login.html';
}

// Mostrar/ocultar botones según rol
const verRegistrosBtn = document.querySelector('a[href="registros.html"]');
verRegistrosBtn.style.display = currentUser.role === 'admin' ? 'inline-block' : 'none';

// Agregar indicador de rol
const userInfo = document.createElement('div');
userInfo.className = 'user-info mb-3';
userInfo.innerHTML = `
    <div class="d-flex justify-content-between align-items-center">
        <span>${currentUser.fullName}</span>
        <span class="badge bg-${getRoleColor(currentUser.role)}">${getRoleName(currentUser.role)}</span>
    </div>
`;
document.querySelector('.container').insertBefore(userInfo, document.querySelector('form'));

function getRoleColor(role) {
    return {
        admin: 'danger',
        conferente: 'success',
        supervisor: 'warning',
        operador: 'info'
    }[role] || 'secondary';
}

function getRoleName(role) {
    return {
        admin: 'Administrador',
        conferente: 'Conferente',
        supervisor: 'Supervisor',
        operador: 'Operador'
    }[role] || 'Usuario';
}

document.getElementById('operationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!validateForm(this)) {
        return;
    }
    
    const formData = new FormData(this);
    const data = {};
    formData.forEach((value, key) => data[key] = value);
    
    // Validar cantidades
    const quantities = ['qtd_linha_08', 'qtd_linha_10', 'qtd_linha_21', 'carregamento_me'];
    quantities.forEach(key => {
        data[key] = data[key] ? parseInt(data[key]) : 0;
    });
    
    // Obtener registros existentes
    let records = JSON.parse(localStorage.getItem('records') || '[]');
    
    // Agregar nuevo registro
    records.push({
        ...data,
        id: Date.now(),
        timestamp: new Date().toISOString()
    });
    
    // Guardar en localStorage
    localStorage.setItem('records', JSON.stringify(records));
    
    showMessage('Registro guardado com sucesso!', 'success');
    this.reset();
});

function validateForm(form) {
    const requiredFields = ['operacao', 'data', 'turno'];
    let isValid = true;
    
    requiredFields.forEach(field => {
        const input = form.elements[field];
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('is-invalid');
        } else {
            input.classList.remove('is-invalid');
        }
    });
    
    if (!isValid) {
        showMessage('Por favor, preencha todos os campos obrigatórios', 'danger');
    }
    
    return isValid;
}

function showMessage(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.querySelector('.container').insertBefore(
        alertDiv,
        document.querySelector('form')
    );
    
    setTimeout(() => alertDiv.remove(), 3000);
}
