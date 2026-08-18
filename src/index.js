import "./style.css";

class TODO {
 
    #id
    #finalized
    #name
    #description
    #date
    #priority

    constructor(id, name, description, date, priority) {
        this.#id = id;
        this.#finalized = false;
        this.#name = name;
        this.#description = description;
        this.#date = date;
        this.#priority = priority
    }

    get config() {

        return {
            id: this.#id,
            finalized: this.#finalized,
            name: this.#name,
            description: this.#description,
            date: this.#date,
            priority: this.#priority
        }
    }

    set config(newData) {
        this.#id = newData.id ? newData.id : this.#id;
        this.#finalized = newData.finalized ? newData.finalized : this.#finalized;
        this.#name = newData.name ? newData.name : this.#name;
        this.#description = newData.description ? newData.description : this.#description;
        this.#date = newData.date ? newData.date : this.#date;
        this.#priority = newData.priority ? newData.priority : this.#priority;
        
    }

}

class Project {
 
    #id
    #name
    #description
    #date

    constructor(id, name, description, date, priority) {
        this.#id = id;
        this.#name = name;
        this.#description = description;
        this.#date = date;
    }

    get config() {

        return {
            id: this.#id,
            name: this.#name,
            description: this.#description,
            date: this.#date,
        }
    }

    set config(newData) {
        this.#id = newData.id ? newData.id : this.#id;
        this.#name = newData.name ? newData.name : this.#name;
        this.#description = newData.description ? newData.description : this.#description;
        this.#date = newData.date ? newData.date : this.#date;
        
    }

}

class Notes {
 
    #id
    #name
    #description

    constructor(id, name, description, date, priority) {
        this.#id = id;
        this.#name = name;
        this.#description = description;
    }

    get config() {

        return {
            id: this.#id,
            name: this.#name,
            description: this.#description,
        }
    }

    set config(newData) {
        this.#id = newData.id ? newData.id : this.#id;
        this.#name = newData.name ? newData.name : this.#name;
        this.#description = newData.description ? newData.description : this.#description;
        
    }

}

class Storer {

    #todos
    #projects
    #notes
    #currentTab

    get todos() {
        return this.#todos;
    }

    set todos(todo) {
        this.#todos.push(todo)
    }

    get projects() {
        return this.#projects;
    }

    set projects(project) {
        this.#projects.push(project)
    }

    get notes() {
        return this.#notes;
    }

    set notes(note) {
        this.#notes.push(note)
    }

    get currentTab() {
        return this.#currentTab;
    }

    set currentTab(tab) {
        this.#currentTab.push(tab)
    }

    deleteItem(itemType, id) {
        if (itemType === 'todo') {
            const todoItem = this.#todos.filter( todo => todo.id === id )
            if (todoItem.length > 0) {
                delete this.#todos.todoItem[0];
            }

            console.log(`[Storer]: No se ha encontrado el id del TODO.`)
        }

        else if (itemType === 'project') {
            const projectItem = this.#projects.filter( project => project.id === id )
            if (projectItem.length > 0) {
                delete this.#projects.projectItem[0];
            }

            console.log(`[Storer]: No se ha encontrado el id del Project.`)
        }

        else if (itemType === 'note') {
            const noteItem = this.#notes.filter( note => note.id === id )
            if (noteItem.length > 0) {
                delete this.#notes.noteItem[0];
            }

            console.log(`[Storer]: No se ha encontrado el id de la Note.`)
        }
    }

}