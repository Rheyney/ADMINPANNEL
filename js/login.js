const openLoginBtn = document.getElementById('openLogin');
const loginPopup = document.getElementById('loginPopup');
const closeBtn = document.querySelector('.close');
const loginForm = document.getElementById('loginForm');

openLoginBtn.addEventListener('click', () => {
    loginPopup.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    loginPopup.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === loginPopup) {
        loginPopup.style.display = 'none';
    }
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Here you would typically send the login data to a server
    // console.log('Login attempt:', {  password });
    
    // For demo purposes, we'll just close the popup
    loginPopup.style.display = 'none';
    alert('Login attempt recorded. Check console for details.');
});