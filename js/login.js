document.getElementById('cpf').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    e.target.value = value;
});

function togglePassword() {
    const senhaInput = document.getElementById('senha');
    const toggleIcon = document.querySelector('.toggle-password');
    
    if (senhaInput.type === 'password') {
        senhaInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        senhaInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const alertContainer = document.getElementById('alertContainer');
    const progressBar = alertContainer.querySelector('.progress-bar');
    
    alertContainer.classList.add('show');
    progressBar.classList.add('animate');
    
    setTimeout(() => {
        alertContainer.classList.remove('show');
        setTimeout(() => {
            progressBar.classList.remove('animate');

        }, 300);
    }, 3000);
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

document.addEventListener('DOMContentLoaded', function() {
    const togglePassword = document.querySelector('.toggle-password');
    const senhaInput = document.querySelector('#senha');

    togglePassword.addEventListener('click', function() {
        const type = senhaInput.getAttribute('type') === 'password' ? 'text' : 'password';
        senhaInput.setAttribute('type', type);
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });

    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const alertContainer = document.getElementById('alertContainer');
        const progressBar = alertContainer.querySelector('.progress-bar');
        
        alertContainer.classList.add('show');
        progressBar.classList.add('animate');
        
        setTimeout(() => {
            alertContainer.classList.remove('show');
            setTimeout(() => {
                progressBar.classList.remove('animate');

            }, 300);
        }, 3000);
    });
});

