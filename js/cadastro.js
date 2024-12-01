function showAlert() {
    const alertContainer = document.getElementById('alertContainer');
    const alert = alertContainer.querySelector('.alert');
    
    alertContainer.style.display = 'block';
    
    setTimeout(() => {
        alert.classList.add('hiding');
        
        setTimeout(() => {
            alertContainer.style.display = 'none';
            alert.classList.remove('hiding');
        }, 500);
    }, 3000);
}

document.getElementById('cadastroForm').addEventListener('submit', function(e) {
    e.preventDefault();
    showAlert();
});

document.querySelector('.close-alert').addEventListener('click', function() {
    const alertContainer = document.getElementById('alertContainer');
    const alert = alertContainer.querySelector('.alert');
    
    alert.classList.add('hiding');
    setTimeout(() => {
        alertContainer.style.display = 'none';
        alert.classList.remove('hiding');
    }, 500);
});

document.getElementById('cpf').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    e.target.value = value;
});

document.getElementById('telefone').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    e.target.value = value;
});

document.getElementById('confirmarSenha').addEventListener('blur', function(e) {
    const senha = document.getElementById('senha').value;
    const confirmarSenha = e.target.value;

    if (senha !== confirmarSenha) {
        alert('As senhas não coincidem!');
        e.target.value = '';
    }
});