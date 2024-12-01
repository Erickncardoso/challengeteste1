document.addEventListener('DOMContentLoaded', function() {
	const appointmentForm = document.getElementById('appointmentForm');
	const appointmentsList = document.getElementById('appointmentsList');
	const notifyBell = document.getElementById('notifyBell');
	const notifyDropdown = document.querySelector('.notify-dropdown');
	const notifyCount = document.querySelector('.notify-count');

	if (appointmentForm) {
		appointmentForm.addEventListener('submit', function(e) {
			e.preventDefault();
			
			
			const formData = new FormData(this);
			const appointmentData = {
				name: formData.get('name'),
				date: formData.get('date'),
				time: formData.get('time'),
				doctor: formData.get('doctor'),
				department: formData.get('department')
			};

			// Criar card de consulta
			const card = createAppointmentCard(appointmentData);
			appointmentsList.appendChild(card);

			// Mostrar notificação
			showNotification('Consulta agendada com sucesso!');

			// Limpar formulário
			this.reset();
		});
	}

	// Função para criar card de consulta
	function createAppointmentCard(data) {
		const card = document.createElement('div');
		card.className = 'appointment-card';
		
		const date = new Date(data.date);
		const formattedDate = date.toLocaleDateString('pt-BR');
		
		card.innerHTML = `
			<img src="./src/img/doctor-avatar.png" alt="${data.doctor}" class="doctor-avatar">
			<div class="appointment-info">
				<h4>${data.doctor}</h4>
				<p><i class="far fa-calendar-alt"></i> ${formattedDate} - ${data.time}</p>
				<span class="tag">${data.department}</span>
			</div>
		`;
		
		return card;
	}

	// Função para mostrar notificação
	function showNotification(message, type = 'success', duration = 5000) {
		const notification = document.createElement('div');
		notification.className = `notification-toast ${type}`;
		
		notification.innerHTML = `
			<div class="notification-content">
				<i class="${type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'}"></i>
				<p>${message}</p>
			</div>
			<div class="progress-bar"></div>
		`;
		
		document.body.appendChild(notification);
		
		// Força um reflow
		notification.offsetHeight;
		
		// Mostra a notificação
		notification.classList.add('show');
		
		// Inicia o progress bar
		const progressBar = notification.querySelector('.progress-bar');
		progressBar.style.width = '0%';
		
		// Remove a notificação
		setTimeout(() => {
			notification.classList.remove('show');
			setTimeout(() => notification.remove(), 300);
		}, duration);
	}

	// Toggle do dropdown de notificações
	notifyBell.addEventListener('click', function(e) {
		e.stopPropagation();
		notifyDropdown.classList.toggle('show');
	});
	
	// Fechar ao clicar fora
	document.addEventListener('click', function(e) {
		if (!notifyDropdown.contains(e.target) && !notifyBell.contains(e.target)) {
			notifyDropdown.classList.remove('show');
		}
	});
	
	// Marcar todas como lidas
	document.querySelector('.notify-mark-read').addEventListener('click', function() {
		notifyCount.style.display = 'none';
		document.querySelectorAll('.notify-item').forEach(item => {
			item.style.opacity = '0.6';
		});
	});

	// Calendário e Consultas
	const calendarManager = {
		currentDate: new Date(),
		appointments: {
			// Exemplo de dados de consultas
			'2023-11-27': [
				{
					patient: 'John Doe',
					time: '10:00',
					type: 'Consulta Regular',
					bloodGroup: 'B+',
					contact: '9995 999 999'
				}
			]
		},

		init() {
			this.renderCalendar();
			this.bindEvents();
			this.loadPatients();
		},

		renderCalendar() {
			const daysContainer = document.getElementById('calendarDays');
			if (!daysContainer) return; // Verifica se o elemento existe

			const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
			const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
			
			const monthTitle = document.getElementById('currentMonth');
			if (monthTitle) {
				monthTitle.textContent = this.currentDate.toLocaleDateString('pt-BR', { 
					month: 'long', 
					year: 'numeric' 
				});
			}

			let daysHTML = '';
			
			// Dias do mês anterior
			for (let i = 0; i < firstDay.getDay(); i++) {
				daysHTML += '<div class="calendar-day empty"></div>';
			}

			// Dias do mês atual
			for (let day = 1; day <= lastDay.getDate(); day++) {
				const date = `${this.currentDate.getFullYear()}-${(this.currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
				const hasAppointment = this.appointments[date] ? 'has-appointment' : '';
				
				daysHTML += `
					<div class="calendar-day ${hasAppointment}" data-date="${date}">
						${day}
					</div>
				`;
			}

			daysContainer.innerHTML = daysHTML;
		},

		bindEvents() {
			const prevBtn = document.getElementById('prevMonth');
			const nextBtn = document.getElementById('nextMonth');
			const daysContainer = document.getElementById('calendarDays');

			if (prevBtn) {
				prevBtn.addEventListener('click', () => {
					this.currentDate.setMonth(this.currentDate.getMonth() - 1);
					this.renderCalendar();
				});
			}

			if (nextBtn) {
				nextBtn.addEventListener('click', () => {
					this.currentDate.setMonth(this.currentDate.getMonth() + 1);
					this.renderCalendar();
				});
			}

			if (daysContainer) {
				daysContainer.addEventListener('click', (e) => {
					const day = e.target.closest('.calendar-day');
					if (day && day.classList.contains('has-appointment')) {
						this.showAppointments(day.dataset.date);
					}
				});
			}
		},

		showAppointments(date) {
			const appointments = this.appointments[date];
			if (!appointments) return;

			const modal = document.getElementById('appointmentModal');
			if (!modal) return;

			const modalBody = modal.querySelector('.modal-body');
			if (!modalBody) return;

			modalBody.innerHTML = appointments.map(apt => `
				<div class="appointment-detail">
					<h4>${apt.patient}</h4>
					<p><strong>Horário:</strong> ${apt.time}</p>
					<p><strong>Tipo:</strong> ${apt.type}</p>
					<p><strong>Grupo Sanguíneo:</strong> ${apt.bloodGroup}</p>
					<p><strong>Contato:</strong> ${apt.contact}</p>
				</div>
			`).join('');

			modal.style.display = 'block';
		},

		loadPatients() {
			const patientsList = document.querySelector('.patients-list');
			if (!patientsList) return;

			// Exemplo de dados de pacientes
			const patients = [
				{
					name: 'John Doe',
					age: '34 yrs | Male',
					id: '#TRUST0231',
					bloodGroup: 'B +ve',
					contact: '9995 999 999',
					lastVisit: '13th Feb 2022'
				}
				// Adicione mais pacientes conforme necessário
			];

			patientsList.innerHTML = patients.map(patient => `
				<div class="patient-card">
					<div class="patient-info">
						<h4>${patient.name}</h4>
						<p>${patient.age}</p>
						<p>${patient.id}</p>
					</div>
					<div class="patient-details">
						<p><strong>Grupo Sanguíneo:</strong> ${patient.bloodGroup}</p>
						<p><strong>Contato:</strong> ${patient.contact}</p>
						<p><strong>Última Visita:</strong> ${patient.lastVisit}</p>
					</div>
				</div>
			`).join('');
		}
	};

	// Inicializa o calendário quando a página carregar
	document.addEventListener('DOMContentLoaded', function() {
		// Mantém o código existente do DOMContentLoaded
		
		// Inicializa o calendário
		calendarManager.init();

		// Função para mostrar o modal com os detalhes da consulta
		function showAppointmentDetails(date) {
			const modal = document.getElementById('appointmentModal');
			const modalBody = modal.querySelector('.modal-body');
			
			// Exemplo de dados da consulta
			const appointment = {
				doctor: 'Dr. Erick',
				date: date,
				time: '10:00',
				type: 'Consulta Regular',
				department: 'Cardiologia',
				patient: 'John Doe',
				status: 'Confirmado'
			};

			modalBody.innerHTML = `
				<div class="appointment-detail">
					<h4>${appointment.doctor}</h4>
					<p>
						<strong>Data:</strong>
						<span>${new Date(date).toLocaleDateString('pt-BR')}</span>
					</p>
					<p>
						<strong>Horário:</strong>
						<span>${appointment.time}</span>
					</p>
					<p>
						<strong>Tipo:</strong>
						<span>${appointment.type}</span>
					</p>
					<p>
						<strong>Departamento:</strong>
						<span>${appointment.department}</span>
					</p>
					<p>
						<strong>Paciente:</strong>
						<span>${appointment.patient}</span>
					</p>
					<p>
						<strong>Status:</strong>
						<span>${appointment.status}</span>
					</p>
				</div>
			`;

			modal.style.display = 'block';
		}

		// Fechar o modal
		const modal = document.getElementById('appointmentModal');
		const closeBtn = modal.querySelector('.close-modal');

		closeBtn.addEventListener('click', () => {
			modal.style.display = 'none';
		});

		// Fechar o modal ao clicar fora dele
		window.addEventListener('click', (e) => {
			if (e.target === modal) {
				modal.style.display = 'none';
			}
		});

		// Adicionar evento de clique aos dias do calendário
		document.addEventListener('click', function(e) {
			const day = e.target.closest('.calendar-day');
			if (day && day.classList.contains('has-appointment')) {
				showAppointmentDetails(day.dataset.date);
			}
		});
	});

	// Adicione este código para o calendário
	document.addEventListener('DOMContentLoaded', function() {
		const calendar = {
			currentDate: new Date(),
			appointments: {
				'2023-11-27': [
					{ time: '10:00', patient: 'Maria Silva', type: 'Consulta Regular' },
					{ time: '11:00', patient: 'João Santos', type: 'Retorno' }
				],
				'2023-11-28': [
					{ time: '14:00', patient: 'Ana Oliveira', type: 'Primeira Consulta' }
				],
				'2023-11-29': [
					{ time: '09:00', patient: 'Pedro Costa', type: 'Consulta Regular' }
				],
				'2023-11-30': [
					{ time: '15:30', patient: 'Lucia Ferreira', type: 'Retorno' }
				]
			},

			init() {
				this.renderCalendar();
				this.bindEvents();
			},

			renderCalendar() {
				const daysContainer = document.getElementById('calendarDays');
				if (!daysContainer) return;

				const year = this.currentDate.getFullYear();
				const month = this.currentDate.getMonth();

				// Atualiza o título do mês
				const monthTitle = document.getElementById('currentMonth');
				if (monthTitle) {
					monthTitle.textContent = new Date(year, month, 1).toLocaleDateString('pt-BR', { 
						month: 'long', 
						year: 'numeric' 
					});
				}

				const firstDay = new Date(year, month, 1);
				const lastDay = new Date(year, month + 1, 0);
				
				let daysHTML = '';
				
				// Dias vazios do início do mês
				for (let i = 0; i < firstDay.getDay(); i++) {
					daysHTML += `<div class="calendar-day empty"></div>`;
				}

				// Dias do mês
				for (let day = 1; day <= lastDay.getDate(); day++) {
					const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
					const hasAppointment = this.appointments[date] ? 'has-appointment' : '';
					const isToday = new Date(date).toDateString() === new Date().toDateString() ? 'today' : '';
					
					daysHTML += `
						<div class="calendar-day ${hasAppointment} ${isToday}" data-date="${date}">
							${day}
							${this.appointments[date] ? 
								`<span class="appointment-dot"></span>` : ''}
						</div>
					`;
				}

				daysContainer.innerHTML = daysHTML;
			},

			bindEvents() {
				const prevBtn = document.getElementById('prevMonth');
				const nextBtn = document.getElementById('nextMonth');

				if (prevBtn) {
					prevBtn.addEventListener('click', () => {
						this.currentDate.setMonth(this.currentDate.getMonth() - 1);
						this.renderCalendar();
					});
				}

				if (nextBtn) {
					nextBtn.addEventListener('click', () => {
						this.currentDate.setMonth(this.currentDate.getMonth() + 1);
						this.renderCalendar();
					});
				}

				// Evento de clique nos dias
				document.addEventListener('click', (e) => {
					const day = e.target.closest('.calendar-day');
					if (day && day.classList.contains('has-appointment')) {
						this.showAppointments(day.dataset.date);
					}
				});
			},

			showAppointments(date) {
				const appointments = this.appointments[date];
				if (!appointments) return;

				const modal = document.getElementById('appointmentModal');
				const modalBody = modal.querySelector('.modal-body');

				modalBody.innerHTML = appointments.map(apt => `
					<div class="appointment-detail">
						<h4>${apt.patient}</h4>
						<p><strong>Horário:</strong> ${apt.time}</p>
						<p><strong>Tipo:</strong> ${apt.type}</p>
					</div>
				`).join('');

				modal.style.display = 'block';
			}
		};

		// Inicializa o calendário
		calendar.init();
	});

	// Função para renderizar o calendário
	function renderCalendar() {
		const date = new Date();
		const month = date.getMonth();
		const year = date.getFullYear();
		
		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);
		
		const daysContainer = document.getElementById('calendarDays');
		let daysHtml = '';
		
		// Dias vazios do início do mês
		for (let i = 0; i < firstDay.getDay(); i++) {
			daysHtml += `<div class="calendar-day empty"></div>`;
		}
		
		// Dias do mês
		for (let day = 1; day <= lastDay.getDate(); day++) {
			const isToday = day === date.getDate() ? 'today' : '';
			const hasAppointment = [5, 10, 15, 20].includes(day) ? 'has-appointment' : '';
			
			daysHtml += `
				<div class="calendar-day ${isToday} ${hasAppointment}">
					${day}
				</div>
			`;
		}
		
		daysContainer.innerHTML = daysHtml;
	}

	// Inicializar o calendário quando a página carregar
	document.addEventListener('DOMContentLoaded', function() {
		renderCalendar();
	});

	// Dados dos pacientes
	const patients = {
		'TRUST0331': {
			name: 'João Silva',
			age: '34 anos | Masculino',
			photo: './src/img/patient-avatar.png',
			bloodGroup: 'B +',
			contact: '(11) 99999-9999',
			height: '175 cm',
			weight: '69 kg',
			ailments: ['Diabético'],
			lastVisit: '13 de Fev 2022'
		},
		'TRUST0332': {
			name: 'Maria Santos',
			age: '28 anos | Feminino',
			photo: './src/img/patient-avatar.png',
			bloodGroup: 'A +',
			contact: '(11) 99999-9998',
			height: '165 cm',
			weight: '58 kg',
			ailments: ['Hipertensão'],
			lastVisit: '15 de Fev 2022'
		}
	};

	// Evento de clique nos cards
	document.querySelectorAll('.patient-card').forEach(card => {
		card.addEventListener('click', function() {
			const patientId = this.dataset.id;
			const patient = patients[patientId];
			
			if (patient) {
				document.getElementById('modalPatientPhoto').src = patient.photo;
				document.getElementById('modalPatientName').textContent = patient.name;
				document.getElementById('modalPatientAge').textContent = patient.age;
				document.getElementById('modalPatientId').textContent = `#${patientId}`;
				document.getElementById('modalBloodGroup').textContent = patient.bloodGroup;
				document.getElementById('modalContact').textContent = patient.contact;
				document.getElementById('modalHeight').textContent = patient.height;
				document.getElementById('modalWeight').textContent = patient.weight;
				document.getElementById('modalLastVisit').textContent = patient.lastVisit;
				
				document.getElementById('modalAilments').innerHTML = patient.ailments
					.map(ailment => `<span class="ailment-tag">${ailment}</span>`)
					.join('');

				document.getElementById('patientDetailsModal').style.display = 'block';
			}
		});
	});

	// Adicione este código junto com o JavaScript existente

	// Função para fechar o modal quando clicar no X
	document.querySelector('.close-modal').addEventListener('click', function() {
		document.getElementById('patientDetailsModal').style.display = 'none';
	});

	// Função para fechar o modal quando clicar fora dele
	window.addEventListener('click', function(event) {
		const modal = document.getElementById('patientDetailsModal');
		if (event.target === modal) {
			modal.style.display = 'none';
		}
	});

	// Prevenir que o modal feche quando clicar dentro dele
	document.querySelector('.modal-content').addEventListener('click', function(event) {
		event.stopPropagation();
	});

	// rx-prescriptions.js
	document.addEventListener('DOMContentLoaded', function() {
		const addMedicationForm = document.querySelector('.rx-medicine-form');
		const medicationsList = document.querySelector('.rx-medications-list');
		const medCount = document.querySelector('.rx-med-count');
		
		addMedicationForm.addEventListener('submit', function(e) {
			e.preventDefault();
			
			// Coletar dados do formulário
			const medicationName = document.querySelector('[placeholder="Digite o nome do medicamento"]').value;
			const concentration = document.querySelector('[placeholder="Ex: 500mg"]').value;
			const instructions = document.querySelector('.rx-textarea').value;
			
			// Criar novo item de medicamento
			const newMedication = createMedicationItem(medicationName, concentration, instructions);
			
			// Adicionar à lista
			const listContainer = medicationsList.querySelector('.rx-list-header').nextElementSibling;
			listContainer.insertBefore(newMedication, listContainer.firstChild);
			
			// Atualizar contador
			updateMedicationCount();
			
			// Mostrar alerta de sucesso
			showSuccessAlert('Medicamento adicionado com sucesso!');
			
			// Limpar formulário
			addMedicationForm.reset();
		});
		
		function createMedicationItem(name, concentration, instructions) {
			const medicationHtml = `
				<div class="rx-medication-item" style="display: none;">
					<div class="rx-med-info">
						<div class="rx-med-icon">
							<i class="fas fa-pills"></i>
						</div>
						<div class="rx-med-details">
							<h4>${name} ${concentration}</h4>
							<p>${instructions}</p>
							<div class="rx-med-tags">
								<span class="rx-tag">Oral</span>
								<span class="rx-tag">5 dias</span>
								<span class="rx-tag">20 comprimidos</span>
							</div>
						</div>
					</div>
					<div class="rx-med-actions">
						<button class="rx-action-btn rx-edit">
							<i class="fas fa-edit"></i>
						</button>
						<button class="rx-action-btn rx-delete">
							<i class="fas fa-trash"></i>
						</button>
					</div>
				</div>
			`;
			
			const div = document.createElement('div');
			div.innerHTML = medicationHtml;
			const medicationElement = div.firstElementChild;
			
			// Adicionar com animação
			setTimeout(() => {
				medicationElement.style.display = 'flex';
				medicationElement.style.animation = 'slideIn 0.3s ease-out';
			}, 100);
			
			return medicationElement;
		}
		
		function updateMedicationCount() {
			const count = document.querySelectorAll('.rx-medication-item').length;
			medCount.textContent = `${count} medicamento${count !== 1 ? 's' : ''}`;
		}
		
		function showSuccessAlert(message) {
			// Criar elemento do alerta
			const alertHtml = `
				<div class="rx-alert-container">
					<div class="rx-alert rx-alert-success">
						<div class="rx-alert-content">
							<i class="fas fa-check-circle"></i>
							<span>${message}</span>
						</div>
						<div class="rx-alert-progress"></div>
					</div>
				</div>
			`;
			
			const alertElement = document.createElement('div');
			alertElement.innerHTML = alertHtml;
			document.body.appendChild(alertElement.firstElementChild);
			
			// Animar progress bar e remover alerta
			setTimeout(() => {
				const alert = document.querySelector('.rx-alert-container');
				if (alert) {
					alert.classList.add('rx-alert-fade-out');
					setTimeout(() => alert.remove(), 300);
				}
			}, 3000);
		}
	});
});











