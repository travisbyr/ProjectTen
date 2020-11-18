const todoList = document.querySelector('#todo-list');
const form = document.querySelector('#add-todo-form');
const updateBtn = document.querySelector('#update');
const logoutItems = document.querySelectorAll('.logged-out');
const loginItems = document.querySelectorAll('.logged-in');

let currentUser = null;
let newTitle = '';
let updateId = null;

// NOTE user display will update depends on the account and db 
function setupUI(user) {
    if (user) {
        loginItems.forEach(item => item.style.display = 'block');
        logoutItems.forEach(item => item.style.display = 'none');
    } else {
        loginItems.forEach(item => item.style.display = 'none');
        logoutItems.forEach(item => item.style.display = 'block');
    }
}

// REVIEW refactor code 
// NOTE Simple rendering for the listed items on the page 
function renderList(doc) {
    let li = document.createElement('li');
    li.className = "collection-item";
    li.setAttribute('data-id', doc.id);

    let div = document.createElement('div');
    let title = document.createElement('span');
    title.textContent = doc.data().title;

    let anchor = document.createElement('a');
    anchor.href = "#modal-edit";
    anchor.className = "modal-trigger secondary-content";

    let editBtn = document.createElement('i');
    editBtn.className = "material-icons";
    editBtn.innerText = "edit";

    let deleteBtn = document.createElement('i');
    deleteBtn.className = "material-icons secondary-content";
    deleteBtn.innerText = "delete";
    anchor.appendChild(editBtn);
    div.appendChild(title);
    div.appendChild(deleteBtn);
    div.appendChild(anchor);
    li.appendChild(div);

    // Event listeners for the delete icon
    deleteBtn.addEventListener('click', e => {
        let id = e.target.parentElement.parentElement.getAttribute('data-id'); // targeting the document data by it's id 
        db.collection('alltodos').doc(currentUser.uid).collection('todos').doc(id).delete(); // calling the delete method by the database functions and removing from the db.
    })
    // Event listener for the edit icon
    editBtn.addEventListener('click', e => {
        updateId = e.target.parentElement.parentElement.parentElement.getAttribute('data-id');
    })
    todoList.append(li);

}

updateBtn.addEventListener('click', e => {
    newTitle = document.getElementsByName('newtitle')[0].value;
    db.collection('alltodos').doc(currentUser.uid).collection('todos').doc(updateId).update({
        title: newTitle
    })
})
// Event listener for the form input 
form.addEventListener('submit', e => {
    e.preventDefault();
    db.collection('alltodos').doc(currentUser.uid).collection('todos').add({ // Storing the input data to firebase with uid value 
        title: form.title.value
    })
    form.title.value = ''; // Clearing the form after submitting 
})

// Fetching db for the auth user and listening to changes on that account 
function getTodos() {
    todoList.innerHTML = '';
    currentUser = auth.currentUser;
    document.querySelector('#user-email').innerHTML = (currentUser != null ? currentUser.email : '');
    console.log('currentUser', currentUser)
    if (currentUser === null) {
        todoList.innerHTML = '<h3 class="center-align">Please login to get todos</h3>';
        return;
    }
    db.collection('alltodos').doc(currentUser.uid).collection('todos').orderBy('title').onSnapshot(snapshot => {
        let changes = snapshot.docChanges()
        changes.forEach(change => {
            if (change.type == 'added') {
                renderList(change.doc); // e-render the node on the DOM 
            } else if (change.type == 'removed') {
                let li = todoList.querySelector(`[data-id=${change.doc.id}]`);
                todoList.removeChild(li); // removing the node from the DOM 
            } else if (change.type == 'modified') {
                let li = todoList.querySelector(`[data-id=${change.doc.id}]`);
                li.getElementsByTagName('span')[0].textContent = newTitle;
                newTitle = '';
            }
        });
    })
}