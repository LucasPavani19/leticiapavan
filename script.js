// Inicialização do EmailJS com a chave correta
(function() {
    emailjs.init("JxP5eK-blb22088E5");
})();

// Carrossel de imagens (sem logs de depuração)
function startCarousel() {
    const images = document.querySelectorAll('.carousel-image');
    let currentIndex = 0;
    images[0].classList.add('active');
    setInterval(() => {
        images[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % images.length;
        images[currentIndex].classList.add('active');
    }, 5000);
}

// Função para sanitizar entradas (removendo caracteres especiais potencialmente perigosos)
function sanitizeInput(str) {
    return str.replace(/[&<>"'\/]/g, function(s) {
        const entityMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '/': '&#x2F;'
        };
        return entityMap[s];
    });
}

// Funcionalidade de agendamento e gerenciamento do banner de cookies
document.addEventListener('DOMContentLoaded', function() {
    const serviceCards = document.querySelectorAll('.service-card');
    const bookingForm = document.getElementById('bookingForm');
    const selectedServiceSpan = document.getElementById('selectedService');
    const appointmentForm = document.getElementById('appointmentForm');
    const formFeedback = document.getElementById('formFeedback');

    // Esconder formulário inicialmente
    if (bookingForm) {
        bookingForm.style.display = 'none';
    }

    // Event listener para o link do menu "Agendar Sessão"
    const menuBookingLink = document.querySelector('a[href="#bookingForm"]');
    if (menuBookingLink && bookingForm) {
        menuBookingLink.addEventListener('click', function(e) {
            e.preventDefault();
            bookingForm.style.display = 'block';
            bookingForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }

    // Selecionar serviço via card
    serviceCards.forEach(card => {
        const selectButton = card.querySelector('.select-service');
        selectButton.addEventListener('click', () => {
            serviceCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            const serviceName = card.getAttribute('data-service');
            selectedServiceSpan.textContent = serviceName;
            if (bookingForm) {
                bookingForm.style.display = 'block';
                formFeedback.textContent = '';
                bookingForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    });

    // Envio do formulário com validação e sanitização
    appointmentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        formFeedback.textContent = '';
        let name = sanitizeInput(document.getElementById('name').value.trim());
        let whatsapp = sanitizeInput(document.getElementById('whatsapp').value.trim());
        let appointmentDate = document.getElementById('appointmentDate').value;
        let service = selectedServiceSpan.textContent;
        
        if (!/^[0-9]{11}$/.test(whatsapp)) {
            formFeedback.textContent = 'Por favor, insira um número de WhatsApp válido';
            return;
        }
        if (name.length < 3) {
            formFeedback.textContent = 'Por favor, insira um nome válido';
            return;
        }
        if (!appointmentDate) {
            formFeedback.textContent = 'Por favor, selecione uma data para a sessão';
            return;
        }
        
        const whatsappMessage = encodeURIComponent(
            `Olá! Gostaria de agendar um horário.\n\n` +
            `Nome: ${name}\n` +
            `Tratamento: ${service}\n` +
            `Data da consulta: ${appointmentDate}\n` +
            `WhatsApp: ${whatsapp}`
        );
        const whatsappLink = `https://api.whatsapp.com/send?phone=5565999417801&text=${whatsappMessage}`;
        
        emailjs.send("service_n0321ef", "template_1u6f2vr", {
            from_name: name,
            service: service,
            whatsapp: whatsapp,
            appointment_date: appointmentDate,
            whatsapp_link: whatsappLink
        })
        .then(function(response) {
            window.open(whatsappLink);
            appointmentForm.reset();
            bookingForm.style.display = 'none';
            serviceCards.forEach(c => c.classList.remove('selected'));
            formFeedback.style.color = 'green';
            formFeedback.textContent = "Email enviado com sucesso! Você será respondido(a) em breve.";
        }, function(error) {
            formFeedback.textContent = "Houve um erro ao processar sua solicitação. Por favor, tente novamente.";
        });
    });
    
    // Iniciar carrossel
    window.addEventListener('load', startCarousel);

    // Lógica do banner de cookies
    const cookieConsent = document.getElementById('cookieConsent');
    const acceptCookiesButton = document.getElementById('acceptCookies');
    
    if (!localStorage.getItem('cookiesAccepted')) {
        cookieConsent.style.display = 'flex';
    } else {
        cookieConsent.style.display = 'none';
    }
    
    acceptCookiesButton.addEventListener('click', function() {
        localStorage.setItem('cookiesAccepted', 'true');
        cookieConsent.style.display = 'none';
    });
});
