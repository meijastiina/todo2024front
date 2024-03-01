import { Task } from './Task.js';

class Todos {
    #tasks = [];
    #backend_url;

    constructor(url) {
        this.#backend_url = url;
    }

    getTasks = async() => {
        return new Promise( async( resolve, reject ) => {
            fetch( this.#backend_url )
            .then(( response ) => response.json() )
            .then(( json ) => {
                this.#readJSON( json );
                resolve( this.#tasks );
            }, ( error ) => {
                reject( error );
            });
        });
    }

    addTask = async( text ) => {
        return new Promise( async( resolve, reject ) => {
            const json = JSON.stringify({ description: text });
            fetch( this.#backend_url + '/new', {
                method: 'post',
                headers: { 'Content-type': 'application/json' },
                body: json,
            })
            .then(( response ) => response.json())
            .then(( json ) => {
                resolve( this.#addToArray( json.id, text ))
            }, ( error ) => {
                reject( error );
            });
        })
    }

    removeTask = async ( id ) => {
        return new Promise( async ( resolve, reject ) => {
            fetch( this.#backend_url + "/delete/" + id, {
                method: 'delete',
            })
            .then(( response ) => response.json())
            .then(( json ) => {
                this.#removeFromArray( id );
                resolve( json.id );
            }, ( error ) => {
                reject( error );
            })
        })
    }

    #readJSON = ( taskAsJSON ) => {
        taskAsJSON.forEach(element => {
            const task = new Task( element.id, element.description );
            this.#tasks.push( task );
        });
    }

    #addToArray = ( id, text ) => {
        const task = new Task( id, text );
        this.#tasks.push( task );
        return task;
    }

    #removeFromArray = ( id ) => {
        const arrayWithoutRemoved = this.#tasks.filter( task => task.id !== id );
        this.#tasks = arrayWithoutRemoved;
    }
}

export { Todos };