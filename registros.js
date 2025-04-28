// Verificar autenticación y permisos - solo admin puede ver registros
const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
if (!currentUser.username || currentUser.role !== 'admin') {
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', function() {
    const records = JSON.parse(localStorage.getItem('records') || '[]');
    const recordsList = document.getElementById('recordsList');
    
    if (records.length === 0) {
        recordsList.innerHTML = '<p>Nenhum registro encontrado.</p>';
        return;
    }
    
    const table = document.createElement('table');
    table.className = 'table table-striped';
    table.innerHTML = `
        <thead>
            <tr>
                <th>Operação</th>
                <th>Data</th>
                <th>Turno</th>
                <th>Linha 08</th>
                <th>Linha 10</th>
                <th>Linha 21</th>
                <th>Ações</th>
            </tr>
        </thead>
        <tbody>
            ${records.map(record => `
                <tr>
                    <td>${record.operacao}</td>
                    <td>${formatDate(record.data)}</td>
                    <td>${record.turno}º Turno</td>
                    <td>${record.qtd_linha_08 || 0}</td>
                    <td>${record.qtd_linha_10 || 0}</td>
                    <td>${record.qtd_linha_21 || 0}</td>
                    <td>
                        <button class="btn btn-sm btn-info" onclick="viewRecord(${record.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteRecord(${record.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('')}
        </tbody>
    `;

    // Envolver tabla en div responsive
    const tableWrapper = document.createElement('div');
    tableWrapper.className = 'table-responsive';
    tableWrapper.appendChild(table);
    
    // Agregar controles móviles
    const mobileControls = document.createElement('div');
    mobileControls.className = 'mobile-controls mt-3';
    mobileControls.innerHTML = `
        <div class="btn-group w-100">
            <button class="btn btn-success" onclick="exportToExcel()">
                <i class="fas fa-file-excel"></i> Exportar
            </button>
            ${currentUser.role === 'admin' ? `
                <a href="index.html" class="btn btn-primary">
                    <i class="fas fa-plus"></i> Novo
                </a>
            ` : ''}
        </div>
    `;
    
    recordsList.appendChild(tableWrapper);
    recordsList.appendChild(mobileControls);

    // Agregar botón de logout
    const logoutBtn = document.createElement('button');
    logoutBtn.className = 'btn btn-danger mt-3';
    logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Sair';
    logoutBtn.onclick = function() {
        sessionStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    };
    document.querySelector('.container').appendChild(logoutBtn);
});

function formatDate(date) {
    return new Date(date).toLocaleDateString('pt-BR');
}

function viewRecord(id) {
    const records = JSON.parse(localStorage.getItem('records') || '[]');
    const record = records.find(r => r.id === id);
    if (record) {
        const details = `
            Operação: ${record.operacao}
            Data: ${formatDate(record.data)}
            Turno: ${record.turno}º
            
            Quantidades:
            - Linha 08: ${record.qtd_linha_08 || 0}
            - Linha 10: ${record.qtd_linha_10 || 0}
            - Linha 21: ${record.qtd_linha_21 || 0}
            - ME: ${record.carregamento_me || 0}
            
            Material Carregado no Saider: ${record.material_saider || 'Não informado'}
            
            Fornecedores:
            - L07: ${record.rotulo_fornecedor_07 || 'Não informado'}
            - L08: ${record.rotulo_fornecedor_08 || 'Não informado'}
            - L10: ${record.rotulo_fornecedor_10 || 'Não informado'}
            - L21: ${record.rotulo_fornecedor_21 || 'Não informado'}
            
            Observações:
            ${record.observacoes || 'Nenhuma'}
        `;
        
        if (window.innerWidth < 768) {
            // Usar modal bootstrap en móvil
            const modal = document.createElement('div');
            modal.className = 'modal fade';
            modal.innerHTML = `
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5>Detalhes do Registro</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <pre>${details}</pre>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            new bootstrap.Modal(modal).show();
        } else {
            alert(details);
        }
    }
}

function deleteRecord(id) {
    // Solo admin puede eliminar
    if (currentUser.role !== 'admin') {
        alert('Apenas administradores podem excluir registros');
        return;
    }
    if (confirm('Tem certeza que deseja excluir este registro?')) {
        let records = JSON.parse(localStorage.getItem('records') || '[]');
        records = records.filter(r => r.id !== id);
        localStorage.setItem('records', JSON.stringify(records));
        location.reload();
    }
}

function exportToExcel() {
    const records = JSON.parse(localStorage.getItem('records') || '[]');
    let csv = 'Operação,Data,Turno,Linha 08,Linha 10,Linha 21,Quantidade ME,Material Saider,Fornecedor L07,Fornecedor L08,Fornecedor L10,Fornecedor L21\n';
    
    records.forEach(record => {
        csv += `"${record.operacao}","${record.data}","${record.turno}","${record.qtd_linha_08 || ''}","${record.qtd_linha_10 || ''}","${record.qtd_linha_21 || ''}","${record.carregamento_me || ''}","${record.material_saider || ''}","${record.rotulo_fornecedor_07 || ''}","${record.rotulo_fornecedor_08 || ''}","${record.rotulo_fornecedor_10 || ''}","${record.rotulo_fornecedor_21 || ''}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'registros.csv';
    link.click();
}
