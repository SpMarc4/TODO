import "./style.css";
import { format, parseISO, getISOWeek, getISOWeekYear } from "date-fns";


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

    static currentTabId = '';
    static currentTabName = 'todos';
    static currentTabType = 'todos';

    static mapper = {
        'todo': 'todos',
        'project': 'projects',
        'note': 'notes',

    };

    get currentTabId() {
        return Storer.currentTabId;
    }

    set currentTabId(tabId) {
        Storer.currentTabId = tabId;
    }

    get currentTabName() {
        return Storer.currentTabName;
    }

    set currentTabName(tabName) {
        Storer.currentTabName = tabName;
    }

    get currentTabType() {
        return Storer.currentTabType;
    }

    set currentTabType(tabType) {
        Storer.currentTabType = tabType;
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
                function (t) { 
                    return t.id === itemId
                
                }
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
            const itemArray = JSON.parse(localStorage.getItem(itemStorage)) ? JSON.parse(localStorage.getItem(itemStorage)) : [];
            console.log(`[Storer]: ${itemStorage} obtenidos correctamente.`);
            return itemArray
        }

        catch{
            console.error(`[Storer]: No se han podido obtener los ${itemStorage}.`);
        }

    }

    static projectTabNameSaver(event) {
        const projectID = event.target.parentElement.id;
        const projectName = event.target.textContent;
        Storer.currentTabId = projectID;
        Storer.currentTabName = projectName;
        Storer.currentTabTypeStore = 'projects';
    }

    static menuTabSaver(event) {
        const tabID = '';
        const tabName = Utils.getClass(event).split(' ').at(1);
        Storer.currentTabId = tabID;
        Storer.currentTabName = tabName;
        if (tabName === 'notes') {
            Storer.currentTabTypeStore = 'notes';
        }

        else {
            Storer.currentTabTypeStore = 'todos';
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


    static todoFilter(data, type) {

        switch (type) {
            case 'today': {
                return data.filter(
                    function (todo) {
                        if (!todo.date) {
                            return false
                        }
                        const currentDate = format(new Date(), 'dd-MM-yyyy');
                        const todoDate = format(new Date(todo.date), 'dd-MM-yyyy');
                        return currentDate === todoDate
                    }

                ) 
            }

            case 'week': {
                const currentDate = new Date();
                const currentWeek = getISOWeek(currentDate);
                const currentYear = getISOWeekYear(currentDate);

                return data.filter(
                    function(todo) {
                        if (!todo.date) {
                            return false
                        }
                        const todoDateFormated = parseISO(todo.date);
                        const todoWeek = getISOWeek(todoDateFormated);
                        const todoYear = getISOWeekYear(todoDateFormated);
                        return (currentWeek === todoWeek) && (currentYear === todoYear)
                    }
                ) 
            }

        }

        return data;

    }


    static projectFilter(data, projectID) {

        return data.filter(
            function (todo) {
                if (!todo.project) {
                    return false
                }

                return todo.project === projectID
            }
        )
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

    static BTNTODOS = document.querySelector('.btn-sidebar.todos');
    static BTNTODAY = document.querySelector('.btn-sidebar.today');
    static BTNWEEK = document.querySelector('.btn-sidebar.week');
    static BTNNOTES = document.querySelector('.btn-sidebar.notes');

    static BTNCREATE = document.querySelector('#create.btn-sidebar');

    static MODALS = document.querySelector('.modals');

    static renderBtns() {
        DOMRenderer.BTNTODOS.addEventListener('click', (event) => {
            const dataProject = EventHandler.menuTabTODOFilter(event)
            const tabName = Storer.currentTabName;
            const tabNameFormatted = tabName.at(0).toUpperCase() + tabName.slice(1).toLowerCase();
            DOMRenderer.renderTODOS(dataProject, tabNameFormatted);

        });
        DOMRenderer.BTNTODAY.addEventListener('click', (event) => {
            const dataProject = EventHandler.menuTabTODOFilter(event)
            const tabName = Storer.currentTabName;
            const tabNameFormatted = tabName.at(0).toUpperCase() + tabName.slice(1).toLowerCase();
            DOMRenderer.renderTODOS(dataProject, tabNameFormatted);

        });
        DOMRenderer.BTNWEEK.addEventListener('click', (event) => {
            const dataProject = EventHandler.menuTabTODOFilter(event)
            const tabName = Storer.currentTabName;
            const tabNameFormatted = tabName.at(0).toUpperCase() + tabName.slice(1).toLowerCase();
            DOMRenderer.renderTODOS(dataProject, tabNameFormatted);
        });
        DOMRenderer.BTNNOTES.addEventListener('click', (event) => {
            const data = EventHandler.menuTabNotes()
            DOMRenderer.renderNotes(data);
        });
        DOMRenderer.BTNCREATE.addEventListener('click', (event) => {
            DOMRenderer.renderCreateModal();
        })
    }

    static renderProjectSidebar(projects) {

        DOMRenderer.PROJECTSIDEBARCONT.innerHTML = '';

        // const projects = Storer.getItems('project');
        // const cleanProjects = Object.values(projects)
        //     .filter( project => project.hasOwnProperty('name'))
        //     .filter( project => project.name);

        for (const project of projects) {
            const projectContainer = document.createElement('div');
            projectContainer.setAttribute('class', 'project-container')
            projectContainer.setAttribute('id', project.id);
            
            const projectButton = document.createElement('button');
            projectButton.setAttribute('class', 'btn-project');
            projectButton.textContent = project.name;
            projectButton.addEventListener('click', (event) => {
                const dataProject = EventHandler.projectSidebarFilter(event);
                DOMRenderer.renderTODOS(dataProject, Storer.currentTabName)
            })

            const deleteButton = document.createElement('button');
            deleteButton.setAttribute('class', 'btn-project');
            deleteButton.textContent = 'X';
            deleteButton.addEventListener('click', (event) => {
                const projects = EventHandler.projectSidebarDeleter(event);

                DOMRenderer.renderProjectSidebar(projects);

                if (Storer.currentTabId === event.target.parentElement.id) {
                    const data = Storer.getItems('todo');
                    DOMRenderer.renderTODOS(data, 'Todos');
                }
            })
            
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
        DOMRenderer.MAIN.appendChild(tabName);

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

            const colEdit = document.createElement('button');
            colEdit.setAttribute('class', 'btn-col col-edit');
            colEdit.setAttribute('id', todo.id);
            colEdit.textContent = 'Edit';

            const colDelete = document.createElement('button');
            colDelete.setAttribute('class', 'btn-col col-delete');
            colDelete.setAttribute('id', todo.id);
            colDelete.textContent = 'X';
            colDelete.addEventListener('click', (event) => {
                const dataFiltered = EventHandler.menuTODODeleter(event);
                const tabName = Storer.currentTabName;
                const tabNameFormatted = tabName.at(0).toUpperCase() + tabName.slice(1).toLowerCase();
                DOMRenderer.renderTODOS(dataFiltered, tabNameFormatted);
            })

            todoItemColAct.appendChild(colDate);
            todoItemColAct.appendChild(colDetail);
            todoItemColAct.appendChild(colEdit);
            todoItemColAct.appendChild(colDelete);


            todoItemCol.appendChild(todoItemColInfo)
            todoItemCol.appendChild(todoItemColAct)

            DOMRenderer.MAIN.appendChild(todoItemCol)
        }
    }

    static renderNotes(notes) {
        DOMRenderer.MAIN.innerHTML = '';
        
        const tabName = document.createElement('h1');
        tabName.setAttribute('class', 'tab-name');
        tabName.textContent = 'Notes';
        DOMRenderer.MAIN.appendChild(tabName);

        const notesCol = document.createElement('div');
        notesCol.setAttribute('class', 'notes-col');

        for (const note of notes) {
            const noteItemCol = document.createElement('div');
            noteItemCol.setAttribute('class', 'note-item-col');
            noteItemCol.setAttribute('id', note.id);
            
            const bntNote = document.createElement('button');
            bntNote.setAttribute('class', 'btn-note-item-col');
            bntNote.textContent = 'X';
            bntNote.addEventListener('click', (event) => {
                const data = EventHandler.noteMainDeleter(event);
                DOMRenderer.renderNotes(data);
            })
            
            const dscrNote = document.createElement('p');
            dscrNote.setAttribute('class', 'dscr-note-item-col');
            dscrNote.textContent = note.description;
        
            noteItemCol.appendChild(bntNote);
            noteItemCol.appendChild(dscrNote);

            notesCol.appendChild(noteItemCol);
        }

        DOMRenderer.MAIN.appendChild(tabName);
        DOMRenderer.MAIN.appendChild(notesCol);
    }

    static renderCreateModal() {
        DOMRenderer.MODALS.display = 'flex';
        console.log('Hey')
    }
}

class EventHandler {

    static projectSidebarFilter(event) {
        Storer.projectTabNameSaver(event);
        const data = Storer.getItems('todo');
        const dataProject = Utils.projectFilter(data, Storer.currentTabId)
        return dataProject;
    }


    static projectSidebarDeleter(event) {
        const projectID = event.target.parentElement.id;
        Manager.deleter('project', projectID);
        const projects = Storer.getItems('project');

        return projects;
    }

    static menuTabTODOFilter(event) {
        Storer.menuTabSaver(event);
        const tabName = Utils.getClass(event).split(' ').at(1);
        if (tabName === 'notes') {
            return
        }
        const data = Storer.getItems('todo');
        const dataFiltered = Utils.todoFilter(data, Storer.currentTabName);
        return dataFiltered;
    }

    static menuTabNotes() {
        const data = Storer.getItems('note');
        return data;
    }

    static menuTODODeleter(event) {
        const todoID = event.target.parentElement.parentElement.id;
        Manager.deleter('todo', todoID);
        const data = Storer.getItems('todo');
        if (Storer.currentTabTypeStore === 'projects') {
            const dataFiltered = Utils.projectFilter(data, Storer.currentTabName) 
            DOMRenderer.renderTODOS(dataFiltered, Storer.currentTabName);
            return
        }
        
        const dataFiltered = Utils.todoFilter(data, Storer.currentTabName);
        return dataFiltered;
    }

    static noteMainDeleter(event) {
        const noteID = event.target.parentElement.id;
        Manager.deleter('note', noteID);
        const data = Storer.getItems('note');
        return data;
    }

}


window.TODO = TODO;
window.Project = Project;
window.Note = Note;
window.Storer = Storer;
window.Utils = Utils;
window.Manager = Manager;
window.DOMRenderer = DOMRenderer;

localStorage.clear();


const project1 = new Project('Project 1', 'Decr1');
const project2 = new Project('Project 2', 'Decr2');
Storer.saveItem('project', project1)
Storer.saveItem('project', project2)

const projects = Storer.getItems('project');
const cleanProjects = Object.values(projects)
    .filter( project => project.hasOwnProperty('name'))
    .filter( project => project.name);

DOMRenderer.renderProjectSidebar(cleanProjects)



// Test render Todos


const todoWeek1 = new TODO('Week11','Week1','2026-09-07','low');
const todoWeek12 = new TODO('Week12','Week1','2026-09-08','low');
const todoWeek13 = new TODO('Week13','Week1','2026-09-09','low');
const todoWeek14 = new TODO('Week14','Week1','2026-09-10','low');
const todoWeek15 = new TODO('Week15','Week1','2026-09-11','low');
const todoWeek16 = new TODO('Week16','Week1','2026-09-12','low');
const todoWeek17 = new TODO('Week17','Week1','2026-09-13','low');
const todoWeek21 = new TODO('Week21','Week2','2026-09-14','low');
Storer.saveItem('todo', todoWeek1)
Storer.saveItem('todo', todoWeek12)
Storer.saveItem('todo', todoWeek13)
Storer.saveItem('todo', todoWeek14)
Storer.saveItem('todo', todoWeek15)
Storer.saveItem('todo', todoWeek16)
Storer.saveItem('todo', todoWeek17)
Storer.saveItem('todo', todoWeek21)

const todos = Storer.getItems('todo');
const todos2 = Utils.todoFilter(todos, 'week')
const cleanTodos = Object.values(todos2)
    .filter( todo => todo.hasOwnProperty('name'))
    .filter( todo => todo.name);

DOMRenderer.renderTODOS(todos, 'Todos')

DOMRenderer.renderBtns()


const note1 = new Note('Nota 1', 'Esta es una nota que sirve de prueba');
const note2 = new Note('Nota 2', 'Esta es una nota que sirve de prueba');
const note3 = new Note('Nota 3', 'Esta es una nota que sirve de prueba');
const note4 = new Note('Nota 4', 'Esta es una nota que sirve de prueba');
Storer.saveItem('note', note1);
Storer.saveItem('note', note2);
Storer.saveItem('note', note3);
Storer.saveItem('note', note4);

// form.addEventListener('submit', function (event) {
//         return Utils.getFormInfo(event, this.elements)
//     }
    
// )