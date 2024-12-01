function maskCPF(e) {
    let value = e.target.value.replace(/\D/g, '');
    

    value = value.slice(0, 11);
    
    if (value.length <= 3) {
        value = value.replace(/(\d{1,3})/, '$1');
    } else if (value.length <= 6) {
        value = value.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    } else if (value.length <= 9) {
        value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else {
        value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    }
    
    e.target.value = value;
}

function maskPhone(e) {
    let value = e.target.value.replace(/\D/g, '');
    

    value = value.slice(0, 11);
    

    if (value.length <= 2) {
        value = value.replace(/(\d{1,2})/, '($1');
    } else if (value.length <= 7) {
        value = value.replace(/(\d{2})(\d{1,5})/, '($1) $2');
    } else {
        value = value.replace(/(\d{2})(\d{5})(\d{1,4})/, '($1) $2-$3');
    }
    
    e.target.value = value;
}

function showAlert(message = 'Operação realizada com sucesso!', type = 'success') {
    const alertContainer = document.getElementById('alertContainer');
    const progressBar = alertContainer.querySelector('.progress-bar');
    const alertMessage = alertContainer.querySelector('.alert span');
    const alert = alertContainer.querySelector('.alert');
    

    alertMessage.textContent = message;
    alert.className = `alert ${type}`;
    

    progressBar.classList.remove('animate');
    void progressBar.offsetWidth;
    

    alertContainer.classList.add('show');
    progressBar.classList.add('animate');

    setTimeout(() => {
        alertContainer.classList.remove('show');
        setTimeout(() => {
            progressBar.classList.remove('animate');
        }, 300);
    }, 3000);
}

function togglePassword(inputId = 'senha') {
    const senhaInput = document.getElementById(inputId);
    const toggleIcon = senhaInput.parentElement.querySelector('.toggle-password');
    
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

function validatePassword(senha, confirmarSenha) {
    if (senha !== confirmarSenha) {
        showAlert('As senhas não coincidem!', 'error');
        return false;
    }
    return true;
}

function initializeOptionCards() {
    const optionCards = document.querySelectorAll('.option-card');
    const continueBtn = document.querySelector('.continue-btn');
    let selectedCard = null;

    if (!optionCards.length || !continueBtn) return;

    optionCards.forEach(card => {
        card.addEventListener('click', () => {
 
            if (selectedCard) {
                selectedCard.classList.remove('selected');
            }
            

            card.classList.add('selected');
            selectedCard = card;
            

            continueBtn.classList.add('active');
        });
    });


    continueBtn.addEventListener('click', () => {
        if (!selectedCard) {
            showAlert('Por favor, selecione um tipo de cadastro', 'error');
            return;
        }

        const tipoUsuario = selectedCard.querySelector('span').textContent.toLowerCase();
        let redirectUrl;
            

        switch(tipoUsuario) {
            case 'paciente':
                redirectUrl = 'cadastro-paciente.html';
                break;
            case 'médico':
                redirectUrl = 'cadastro-medico.html';
                break;
            case 'enfermaria':
            case 'manutenção':
            case 'limpeza':
                redirectUrl = 'cadastro-funcionario.html';
                break;
            default:
                showAlert('Tipo de cadastro inválido', 'error');
                return;
        }

        continueBtn.classList.add('loading');
        setTimeout(() => {
            window.location.href = redirectUrl;
        }, 300);
    });
}


function openModal(modalId) {
    const modal = document.getElementById(modalId);
    const overlay = document.getElementById('modalOverlay');
    
    if (modal && overlay) {
        modal.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    const overlay = document.getElementById('modalOverlay');
    
    modals.forEach(modal => modal.classList.remove('active'));
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
}

function redirectTo(url) {
    window.location.href = url;
}

document.addEventListener('DOMContentLoaded', function() {
    const toggles = document.querySelectorAll('.toggle-password');
    toggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.closest('.input-field').querySelector('input');
            togglePassword(input.id);
        });
    });

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        const cpfInput = document.getElementById('cpf');
        if (cpfInput) {
            cpfInput.addEventListener('input', maskCPF);
        }

        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showAlert('Login realizado com sucesso!');

        });
    }

    const cadastroForm = document.getElementById('cadastroForm');
    if (cadastroForm) {
        const cpfCadastro = document.getElementById('cpf');
        const telefone = document.getElementById('telefone');
        
        if (cpfCadastro) cpfCadastro.addEventListener('input', maskCPF);
        if (telefone) telefone.addEventListener('input', maskPhone);

        const senha = document.getElementById('senha');
        const confirmarSenha = document.getElementById('confirmarSenha');
        
        if (confirmarSenha) {
            confirmarSenha.addEventListener('blur', function() {
                validatePassword(senha.value, this.value);
            });
        }

        cadastroForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (senha && confirmarSenha) {
                if (!validatePassword(senha.value, confirmarSenha.value)) return;
            }
            showAlert('Cadastro realizado com sucesso!');
  
        });
    }

    initializeOptionCards();

    const cpfInputs = document.querySelectorAll('input[id="cpf"]');
    const telefoneInputs = document.querySelectorAll('input[id="telefone"]');
    
    cpfInputs.forEach(input => {
        input.addEventListener('input', maskCPF);
        input.addEventListener('paste', function(e) {
            e.preventDefault();
            const text = (e.originalEvent || e).clipboardData.getData('text/plain');
            const formattedText = text.replace(/\D/g, '').slice(0, 11);
            this.value = formattedText;
            maskCPF({target: this});
        });
    });
    
    telefoneInputs.forEach(input => {
        input.addEventListener('input', maskPhone);
        input.addEventListener('paste', function(e) {
            e.preventDefault();
            const text = (e.originalEvent || e).clipboardData.getData('text/plain');
            const formattedText = text.replace(/\D/g, '').slice(0, 11);
            this.value = formattedText;
            maskPhone({target: this});
        });
    });

    const optionCards = document.querySelectorAll('.option-card');
    const overlay = document.getElementById('modalOverlay');
    const closeButtons = document.querySelectorAll('.close-modal');

    optionCards.forEach(card => {
        card.addEventListener('click', () => {
            const tipo = card.querySelector('span').textContent.toLowerCase();
            
            switch(tipo) {
                case 'paciente':
                    openModal('modalPaciente');
                    break;
                case 'médico':
                    openModal('modalMedico');
                    break;
                case 'enfermaria':
                    openModal('modalEnf');
                    break;
                case 'manutenção':
                    openModal('modalManutec');
                    break;
                case 'limpeza':
                    openModal('modalLimp');
                    break;
            }
        });
    });

    overlay.addEventListener('click', closeAllModals);

    closeButtons.forEach(button => {
        button.addEventListener('click', closeAllModals);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAllModals();
    });
});