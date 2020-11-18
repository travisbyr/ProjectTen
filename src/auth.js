auth.onAuthStateChanged(user => {
    getTodos();
    setupUI(user);
})

//ANCHOR logging out using firebase method signOut  
const logout = document.querySelector('#logout');
logout.addEventListener('click', e => {
    e.preventDefault()
    auth.signOut();
})

const loginForm = document.querySelector('#login-form');
console.log(loginForm['login-email'].value)
//  ANCHOR Setup the login  page with db and catching errors
loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;
    auth.signInWithEmailAndPassword(email, password).then(() => {
        const modal = document.querySelector('#modal-login');
        M.Modal.getInstance(modal).close();
        loginForm.querySelector('.error').innerHTML = '';
        loginForm.reset();
    }).catch(err => {
        loginForm.querySelector('.error').innerHTML = err.message
    })
})

const signupForm = document.querySelector('#signup-form');
console.log(signupForm['signup-email'].value)
// ANCHOR Setup the event listener for sing up page with catching errors 
signupForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;
    auth.createUserWithEmailAndPassword(email, password).then(() => {
        const modal = document.querySelector('#modal-signup');
        M.Modal.getInstance(modal).close();
        signupForm.querySelector('.error').innerHTML = '';
        signupForm.reset();
    }).catch(err => {
        signupForm.querySelector('.error').innerHTML = err.message
    })
})