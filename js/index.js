const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
//const BACKEND_ROOT_URL = 'http://localhost:3001';
const BACKEND_ROOT_URL = 'https://todo2024back.onrender.com';
import { Todos } from './class/Todos.js';

const todos =  new Todos( BACKEND_ROOT_URL );

input.addEventListener('keypress', (event) => {

    if (event.key === 'Enter') {
        const task = input.value.trim();    
        event.preventDefault();
        todos.addTask(task).then((task) => {
            renderTask(task);
            input.value = '';
            input.focus();
        });
    }
});

const renderTask = ( task ) => {
    const li = document.createElement("li"); 
    li.classList.add("list-group-item");
    li.setAttribute( 'data-key', task.getId().toString());
    renderSpan(li, task.getText());
    renderLink(li, task.getId());
    list.appendChild(li);
}

const renderSpan = ( li, text ) => {
    const span = li.appendChild(document.createElement('span'));
    span.innerHTML = text; 
}

const renderLink = ( li, id ) => {
    const a = li.appendChild(document.createElement('a'));
    const i = document.createElement('i');
    i.classList.add("bi", "bi-trash");
    a.appendChild(i);
    a.style = "float: right; cursor: pointer;";
    a.addEventListener( 'click', (event) => {
        todos.removeTask( id ).then(( removedId ) => {
            const liToRemove = document.querySelector(`[data-key='${ removedId  }']`);
            if ( liToRemove ) {
                list.removeChild( liToRemove );
            }
        }).catch(( error ) => {
            alert( error );
        });
    });
}

const getTasks = async () => {
   todos.getTasks().then(( tasks ) => {
        tasks.forEach(task => {
            renderTask( task );
        })
        input.disabled = false;
   }).catch(( error ) => {
        alert( error );
   });
}

const saveTask = async ( task ) => {
    saveTask( task );
    input.value = "";
}


getTasks();