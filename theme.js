// theme.js

/* 
 * Este script é responsável por gerenciar o tema do site.
 * Ele adiciona um evento de mudança ao switch de tema, que
 * altera o tema do site entre claro e escuro.
 */

// Verificar se há preferência salva
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

// Atualizar estado do switch baseado no tema atual
const themeToggle = document.getElementById('themeToggle');
themeToggle.checked = savedTheme === 'dark';

// Adicionar evento de mudança ao switch
themeToggle.addEventListener('change', function() {
    const newTheme = this.checked ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}); 