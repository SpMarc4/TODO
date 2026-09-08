import "./style.css";

const form = document.querySelector('form');
const btnModal = document.querySelector('.btn-modal-add');

export class TODO {

    constructor(name, description, date, priority, project = null) {
        this.id = Utils.generateID();
        this.finalized = false;
        this.name = name;
        this.description = description;
        this.date = date;
        this.priority = priority;
        this.project = project
    }

}

export class Project {

    constructor(name, description) {
        this.id = Utils.generateID();
        this.name = name;
        this.description = description;
    }

}

export class Note {

    constructor(name, description) {
        this.id = Utils.generateID();
        this.name = name;
        this.description = description;
    }

}

export class Storer {

    static currentTabStore = '';

    static mapper = {
        'todo': 'todos',
        'project': 'projects',
        'note': 'notes',

    };

    get currentTab() {
        return Storer.currentTabStore;
    }

    set currentTab(tab) {
        Storer.currentTabStore = tab;
    }

    static #updatedList(itemType, item) {
        const itemStorage = Storer.mapper[itemType];
        const listObj = JSON.parse(localStorage.getItem(itemStorage));
        listObj.push(item);
        return JSON.stringify(listObj);
    }
    
    static #itemChecker(itemType) {
        if (!Storer.mapper.hasOwnProperty(itemType)) {
            throw new Error(`[Storer]: Item incorrecto. Seleccione uno entre: todo, project o note.`)
        }
    }

    static #typeItemChecker(itemType, item) {
        if (itemType === 'todo') {
            if (item instanceof TODO) {
                return
            }
            
            else {
                throw new Error(`[Storer]: Clase del item incorrecta. Asegúrese que sea un TODO`)
            }
        }

        else if (itemType === 'project') {
            if (item instanceof Project) {
                return
            }
            
            else {
                throw new Error(`[Storer]: Clase del item incorrecta. Asegúrese que sea un Project`)
            }
        }

        if (itemType === 'note') {
            if (item instanceof Note) {
                return
            }
            
            else {
                throw new Error(`[Storer]: Clase del item incorrecta. Asegúrese que sea una Note`)
            }
        }
    }

    static saveItem(itemType, item) {

        Storer.#itemChecker(itemType);
        Storer.#typeItemChecker(itemType, item);

        const itemStorage = Storer.mapper[itemType];

        if (!localStorage.getItem(itemStorage)) {
            localStorage.setItem(itemStorage, JSON.stringify([]));
        }

        try {
            const listStr = Storer.#updatedList(itemType, item);
            localStorage.setItem(itemStorage, listStr);
            console.log(`[Storer]: ${itemType} almacenado correctamente.`);
        }

        catch {
            console.error(`[Storer]: No se ha podido almacenar el ${itemType}.`);
        }
    }
    
    static getItem(itemType, itemId) {
        
        Storer.#itemChecker(itemType);

        try {
            const itemStorage = Storer.mapper[itemType];

            const listObj = JSON.parse(localStorage.getItem(itemStorage));
            const filteredList = listObj.filter( t => t.id === itemId );

            if (filteredList.length < 1) {
                console.log(`[Storer]: Id no encontrado ${itemId}. Asegurese del formato.`)
                return
            }

            console.log(`[Storer]: ${itemType} ${itemId} obtenido correctamente.`);
            return filteredList[0];
        }

        catch {
            console.error(`[Storer]: No se ha podido obtener el ${itemType} ${itemId}.`);
        }

    }

    static deleteItem(itemType, itemId) {

        Storer.#itemChecker(itemType);

        try {
            const itemStorage = Storer.mapper[itemType];

            const listObj = JSON.parse(localStorage.getItem(itemStorage));

            const itemsFound = listObj.filter(
                t => t.id === itemId
            )
            const filteredList = JSON.stringify(
                listObj.filter(
                    t => t.id !== itemId
                )
            );

            if (itemsFound.length < 1) {
                console.log(`[Storer]: Id no encontrado ${itemId}. Asegúrese del formato.`)
                return
            }

            localStorage.setItem(itemStorage, filteredList);
        
            console.log(`[Storer]: ${itemType} ${itemId} eliminado correctamente.`);
        }

        catch {
            console.error(`[Storer]: No se ha podido eliminar el ${itemType} ${itemId}.`);
        }

    }

    static getItems(itemType) {

        Storer.#itemChecker(itemType);

        const itemStorage = Storer.mapper[itemType];

        try {
            console.log(`[Storer]: ${itemStorage} obtenidos correctamente.`);
            return JSON.parse(localStorage.getItem(itemStorage));
        }

        catch{
            console.error(`[Storer]: No se han podido obtener los ${itemStorage}.`);
        }

    }
}

export class Utils {

    static generateID() {
        return crypto.randomUUID()
    }

    static getID(element) {
        return element.target.id;
    }
    
    static getClass(element) {
        return element.target.className;
    }

    static getFormInfo(event, elements) {
        try {
            event.preventDefault();
            let config = {};
            for(const element of elements) {
                const idElem = element.id;
                const valueElem = element.value;
                config[idElem] = valueElem;
            }
            console.log(`[Utils] Configuración obtenida correctamente:\n${config}`);
            return config;
        }

        catch {
            console.error(`[Utils] No se ha podido obtener la configuración`)
        }
    }

    static dataFormatter(data) {
        try {
            for ( const key of Object.keys(data)) {
                const cleanKey = key.split('-').at(-1);
                data[cleanKey] = data[key];
                delete data[key]
            }
            console.log(`[Utils] Formateo de los datos correcto`)
            return data
        }

        catch {
            console.Error(`[Utils] No se han podido formatear los datos correctamente.`)
            
        }
    }
}

export class Manager {

    static #todoCreator(data) {

        const todo = new TODO(
            data.name,
            data.description,
            data.date,
            data.priority
        )

        Storer.saveItem('todo', todo)
    }

    static todoDateFilter(data, type) {

        switch (type) {
            case 'today': {
                return data.filter(
                    todo => Date.parse(todo.date) === Date.now()
                ) 
            }

            case 'week': {
                const currentDate = new Date();
                const currentDateString = currentDate.toString();
                const currentWeek = Manager.#getweek(currentDateString);
                const currentYear = currentDate.getFullYear();

                const newDate = date.setDate(date.getDate()+ 7);
                console.log(newDate)
                return data.filter(
                    function(todo) {
                        const todoDate = todo.date;
                        const todoDateFormated = new Date(todo.date);
                        const todoWeek = Manager.#getweek(todoDate);
                        const todoYear = todoDateFormated.getFullYear();
                        return (currentWeek === todoWeek) && (currentYear === todoYear)
                    }
                ) 
            }
        }

    }

    static #getweek(date) {
        const dateFormat = new Date(date)
        const firstYearDate = new Date(dt.getFullYear(), 0, 1);
        const daysPassed = Math.floor((dateFormat - firstYearDate)/(1000 * 0 * 60 * 24));
        const weekDay = dateFormat.getDate();
        const weekDayFormated = (weekDay === 0) ? 6: weekDay - 1;

        const week = Math.floor((daysPassed + weekDayFormated)/7 +1)
        return week
    }   

    static #projectCreator(data) {
        const project = new Project(
            data.name,
            data.description,
        )

        Storer.saveItem('project', project)
    }

    static #noteCreator(data) {
        const note = new Note(
            data.name,
            data.description,
        )

        Storer.saveItem('note', note)
    }

    static creator(itemType, data) {
        const cleanData = Utils.dataFormatter(data)
        console.log(cleanData)
        switch (itemType) {
            case 'todo':
                Manager.#todoCreator(cleanData);
            case 'project':
                Manager.#projectCreator(cleanData);
            case 'note':
                Manager.#noteCreator(cleanData);
        }
    }

    static deleter(itemType, itemId) {
        Storer.deleteItem(itemType, itemId)
    }

}

export class DOMRenderer {

    static HEADER = document.querySelector('.todo-header');
    static SIDEBAR = document.querySelector('.todo-sidebar');
    static MENUSIDEBAR = document.querySelector('.menu-sidebar');
    static PROJECTSIDEBAR = document.querySelector('.projects-sidebar');
    static PROJECTSIDEBARCONT = document.querySelector('.projects-sidebar-container');

    static MAIN = document.querySelector('.todo-main');

    static renderProjectSidebar(projects) {

        DOMRenderer.PROJECTSIDEBARCONT.innerHTML = '';

        // const projects = Storer.getItems('project');
        // const cleanProjects = Object.values(projects)
        //     .filter( project => project.hasOwnProperty('name'))
        //     .filter( project => project.name);

        for (const project of projects) {
            const projectContainer = document.createElement('div');
            projectContainer.setAttribute('class', 'project-container')
            
            const projectButton = document.createElement('button');
            projectButton.setAttribute('class', 'btn-project');
            projectButton.setAttribute('id', project.id);
            projectButton.textContent = project.name;

            const deleteButton = document.createElement('button');
            deleteButton.setAttribute('class', 'btn-project');
            deleteButton.textContent = 'X';
            
            projectContainer.appendChild(projectButton);
            projectContainer.appendChild(deleteButton)
            DOMRenderer.PROJECTSIDEBARCONT.appendChild(projectContainer);
        }
        

        console.log(`[Render] Renderizado de proyectos completado.`)
      
    }

    static renderTODOS(todos, currentTab) {
        DOMRenderer.MAIN.innerHTML = '';
        
        const tabName = document.createElement('h1');
        tabName.setAttribute('class', 'tab-name');
        tabName.textContent = currentTab;

        for (const todo of todos) {
            const todoItemCol = document.createElement('div');
            todoItemCol.setAttribute('class', 'todo-item-col');
            todoItemCol.setAttribute('id', todo.id);

            const todoItemColInfo = document.createElement('div');
            todoItemColInfo.setAttribute('class', 'todo-item-col-info');
            
            const colPrior = document.createElement('div');
            colPrior.setAttribute('class', 'col-prior');

            const colCheck = document.createElement('input');
            colCheck.setAttribute('type', 'checkbox');
            colCheck.setAttribute('class', 'col-check');

            const colName = document.createElement('div');
            colName.setAttribute('class', 'col-name');
            colName.textContent = todo.name;

            todoItemColInfo.appendChild(colPrior);
            todoItemColInfo.appendChild(colCheck);
            todoItemColInfo.appendChild(colName);


            const todoItemColAct = document.createElement('div');
            todoItemColAct.setAttribute('class', 'todo-item-col-act');

            const colDate = document.createElement('div');
            colDate.setAttribute('class', 'col-date');
            colDate.textContent = todo.date ? todo.date : '';

            const colDetail = document.createElement('button');
            colDetail.setAttribute('class', 'btn-col col-detail');
            colDetail.setAttribute('id', todo.id);
            colDetail.textContent = '?';
            // Lógica addEventListener

            const colEdit = document.createElement('button');
            colEdit.setAttribute('class', 'btn-col col-edit');
            colEdit.setAttribute('id', todo.id);
            colEdit.textContent = 'Edit';
            // Lógica addEventListener

            const colDelete = document.createElement('button');
            colDelete.setAttribute('class', 'btn-col col-delete');
            colDelete.setAttribute('id', todo.id);
            colDelete.textContent = 'X';
            // Lógica addEventListener

            todoItemColAct.appendChild(colDate);
            todoItemColAct.appendChild(colDetail);
            todoItemColAct.appendChild(colEdit);
            todoItemColAct.appendChild(colDelete);


            todoItemCol.appendChild(todoItemColInfo)
            todoItemCol.appendChild(todoItemColAct)

            DOMRenderer.MAIN.appendChild(todoItemCol)
        }


    }

}

window.TODO = TODO;
window.Project = Project;
window.Note = Note;
window.Storer = Storer;
window.Utils = Utils;
window.Manager = Manager;
window.DOMRenderer = DOMRenderer;


const projects = Storer.getItems('project');
const cleanProjects = Object.values(projects)
    .filter( project => project.hasOwnProperty('name'))
    .filter( project => project.name);

DOMRenderer.renderProjectSidebar(cleanProjects)

const todos = Storer.getItems('todo');
const cleanTodos = Object.values(todos)
    .filter( todo => todo.hasOwnProperty('name'))
    .filter( todo => todo.name);

DOMRenderer.renderTODOS(cleanTodos)

// form.addEventListener('submit', function (event) {
//         return Utils.getFormInfo(event, this.elements)
//     }
    
// )