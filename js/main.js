function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}

function handleSubscribe(e) {
  e.preventDefault();
  const input = e.target.querySelector('input');
  alert(currentLang === 'tl'
    ? 'Salamat sa pag-subscribe! Maligayang pagdating sa aming komunidad.'
    : 'Thank you for subscribing! Welcome to the community.');
  input.value = '';
}

function handleContact(e) {
  e.preventDefault();
  alert(currentLang === 'tl'
    ? 'Natanggap ang iyong mensahe! Makikipag-ugnayan ako sa iyo sa lalong madaling panahon.'
    : 'Message received! I\'ll get back to you as soon as possible.');
  e.target.reset();
}

window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (navbar) navbar.style.background = window.scrollY > 50
    ? 'rgba(10,10,10,0.99)'
    : 'rgba(10,10,10,0.9)';
});
