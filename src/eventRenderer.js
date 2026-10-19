import { Storer, Manager } from "./main.js";
import { Utils } from "./utils.js";
import { format } from "date-fns";

export class DOMRenderer {

    static HEADER = document.querySelector('.todo-header');
    static SIDEBAR = document.querySelector('.todo-sidebar');
    static MENUSIDEBAR = document.querySelector('.menu-sidebar');
    static PROJECTSIDEBAR = document.querySelector('.projects-sidebar');
    static PROJECTSIDEBARCONT = document.querySelector('.projects-sidebar-container');
    static FOOTER = document.querySelector('.todo-footer');

    static MAIN = document.querySelector('.todo-main');

    static BTNTODOS = document.querySelector('.btn-sidebar.todos');
    static BTNTODAY = document.querySelector('.btn-sidebar.today');
    static BTNWEEK = document.querySelector('.btn-sidebar.week');
    static BTNNOTES = document.querySelector('.btn-sidebar.notes');

    static BTNCREATE = document.querySelector('#create.btn-sidebar');

    static MODALS = document.querySelector('.modals');


    static #clockTick() {
        const date = format(new Date(), 'dd-MM-yyyy');
        DOMRenderer.FOOTER.textContent = 'Date: ' + date;
    }

    static renderDate() {
        DOMRenderer.#clockTick();
        setInterval(DOMRenderer.#clockTick, 30000);
    }

    static renderBtns() {
        DOMRenderer.BTNTODOS.addEventListener('click', (event) => {
            const dataProject = EventHandler.menuTabTODOFilter(event)
            const tabName = Storer.currentTabName;
            const tabNameFormatted = tabName.at(0).toUpperCase() + tabName.slice(1);
            DOMRenderer.renderTODOS(dataProject, tabNameFormatted);

        });
        DOMRenderer.BTNTODAY.addEventListener('click', (event) => {
            const dataProject = EventHandler.menuTabTODOFilter(event)
            const tabName = Storer.currentTabName;
            const tabNameFormatted = tabName.at(0).toUpperCase() + tabName.slice(1);
            DOMRenderer.renderTODOS(dataProject, tabNameFormatted);

        });
        DOMRenderer.BTNWEEK.addEventListener('click', (event) => {
            const dataProject = EventHandler.menuTabTODOFilter(event)
            const tabName = Storer.currentTabName;
            const tabNameFormatted = tabName.at(0).toUpperCase() + tabName.slice(1);
            DOMRenderer.renderTODOS(dataProject, tabNameFormatted);
        });
        DOMRenderer.BTNNOTES.addEventListener('click', (event) => {
            const data = EventHandler.menuTabNotes(event)
            DOMRenderer.renderNotes(data);
        });
        DOMRenderer.BTNCREATE.addEventListener('click', (event) => {
            DOMRenderer.renderCreateModal();
        })
    }

    static renderProjectSidebar(projects) {

        DOMRenderer.PROJECTSIDEBARCONT.innerHTML = '';

        for (const project of projects) {
            console.log(project)
            const projectContainer = document.createElement('div');
            projectContainer.setAttribute('class', 'project-container')
            projectContainer.setAttribute('id', project.id);
            
            const projectButton = document.createElement('button');
            projectButton.setAttribute('class', 'btn-project');
            projectButton.textContent = project.name;
            projectButton.addEventListener('click', (event) => {
                const dataProject = EventHandler.projectSidebarFilter(event);
                const tabName = Storer.currentTabName;
                const tabNameFormatted = tabName.at(0).toUpperCase() + tabName.slice(1);
                DOMRenderer.renderTODOS(dataProject, tabNameFormatted)
            })

            const deleteButton = document.createElement('button');
            deleteButton.setAttribute('class', 'btn-project');
            deleteButton.textContent = 'X';
            deleteButton.addEventListener('click', (event) => {
                const projects = EventHandler.projectSidebarDeleter(event);

                DOMRenderer.renderProjectSidebar(projects);

                if (Storer.currentTabId === event.target.parentElement.id) {
                    Storer.currentTabId = '';
                    Storer.currentTabName = 'todos';
                    Storer.currentTabType = 'todos';
                    const data = Storer.getItems('todo');
                    DOMRenderer.renderTODOS(data, 'Todos');
                }

                else {
                    const data = Utils.mainDataFilter();
                    const tabType = Storer.currentTabType;
                    DOMRenderer.renderMain(data, tabType);
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
            let color;
            switch (todo.priority) {
                case 'low':
                    color = 'green';
                    break
                case 'medium':
                    color = 'yellow';
                    break
                case 'high':
                    color = 'red';
                    break
            }

            console.log(color)

            colPrior.setAttribute('style', `background-color: ${color}; opacity: 0.2`);

            const colCheck = document.createElement('input');
            colCheck.setAttribute('type', 'checkbox');
            colCheck.setAttribute('class', 'col-check');
            colCheck.addEventListener('click', (event) => {
                EventHandler.checkBoxAlter(event);
            })
            colCheck.checked = todo.finalized;
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
            colDetail.textContent = '?';
            colDetail.addEventListener('click', (event) => {
                const todoData = EventHandler.todoData(event, 'info');
                DOMRenderer.renderTODOModal(todoData);
            })

            const colEdit = document.createElement('button');
            colEdit.setAttribute('class', 'btn-col col-edit');
            colEdit.textContent = 'Edit';
            colEdit.addEventListener('click', (event) => {
                const todoData = EventHandler.todoData(event, 'edit');
                DOMRenderer.renderTODOModal(todoData);
            });

            const colDelete = document.createElement('button');
            colDelete.setAttribute('class', 'btn-col col-delete');
            colDelete.textContent = 'X';
            colDelete.addEventListener('click', (event) => {
                const dataFiltered = EventHandler.menuTODODeleter(event);
                const tabName = Storer.currentTabName;
                const tabNameFormatted = tabName.at(0).toUpperCase() + tabName.slice(1);
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

    static renderMain(data, currentTabType = '') {
        if (currentTabType === 'notes') {
            DOMRenderer.renderNotes(data)
            return
        }

        else if (currentTabType === 'projects' || currentTabType === 'todos') {
            const tabName = Storer.currentTabName;
            const tabNameFormatted = tabName.at(0).toUpperCase() + tabName.slice(1);
            DOMRenderer.renderTODOS(data, tabNameFormatted);
        }
    }

    static renderCreateModal() {
        DOMRenderer.MODALS.innerHTML = '';
        DOMRenderer.MODALS.style['display'] = 'flex';

        const modalCreate = document.createElement('div');
        modalCreate.setAttribute('class', 'modal-create')
        
        const btnProject = document.createElement('button');
        btnProject.setAttribute('class', 'btn-modal');
        btnProject.textContent = 'Project';
        btnProject.addEventListener('click', () => {
            DOMRenderer.renderProjectEditModal();
        })

        const btnTODO = document.createElement('button');
        btnTODO.setAttribute('class', 'btn-modal');
        btnTODO.textContent = 'TODO';
        btnTODO.addEventListener('click', () => {
            DOMRenderer.renderTODOModal(
                {
                    mode : 'edit'
                }
            );
        })

        const btnNote = document.createElement('button');
        btnNote.setAttribute('class', 'btn-modal');
        btnNote.textContent = 'Note';
        btnNote.addEventListener('click', () => {
            DOMRenderer.renderNoteEditModal();
        })

        const btnClose = document.createElement('button');
        btnClose.setAttribute('class', 'btn-modal-close');
        btnClose.textContent = 'X';
        btnClose.addEventListener('click', () => {
            DOMRenderer.renderCloseModal();
        })

        modalCreate.appendChild(btnProject);
        modalCreate.appendChild(btnTODO);
        modalCreate.appendChild(btnNote);
        modalCreate.appendChild(btnClose);

        DOMRenderer.MODALS.appendChild(modalCreate);

    }

    static renderCloseModal() {
        DOMRenderer.MODALS.innerHTML = '';
        DOMRenderer.MODALS.style['display'] = 'none';
    }

    static renderTODOModal(
        {
            id = '',
            name = '',
            description = '',
            date = '',
            priority = '',
            mode = 'edit'
        }
    ) {
        DOMRenderer.MODALS.innerHTML = '';
        DOMRenderer.MODALS.style['display'] = 'flex';
        
        const modalTODOEdit = document.createElement('div');
        modalTODOEdit.setAttribute('class', `modal-todo ${mode}`);

        const btnClose = document.createElement('button');
        btnClose.setAttribute('class', 'btn-modal-close edit');
        btnClose.textContent = 'X';
        btnClose.addEventListener('click', () => {
            DOMRenderer.renderCloseModal();
        })

        const formTODO = document.createElement('form');
        formTODO.setAttribute('class', 'form-todo');

        const formTODOFieldName = document.createElement('div');
        formTODOFieldName.setAttribute('class', 'form-todo-field');
        const todoLabelName = document.createElement('label');
        todoLabelName.setAttribute('for', 'todo-field-name');
        todoLabelName.textContent = 'TODO Name:';
        const inputName = document.createElement('input');
        inputName.setAttribute('type', 'text');
        inputName.setAttribute('id', 'todo-field-name');
        inputName.setAttribute('placeholder', 'Write here...');
        inputName.setAttribute('required', '');
        inputName.setAttribute('name', 'name');
        inputName.setAttribute('value', name);
        inputName.textContent = name;

        formTODOFieldName.appendChild(todoLabelName);
        formTODOFieldName.appendChild(inputName);

        const formTODOFieldDscr = document.createElement('div');
        formTODOFieldDscr.setAttribute('class', 'form-todo-field');
        const todoFieldDscr = document.createElement('label');
        todoFieldDscr.setAttribute('for', 'todo-field-description');
        todoFieldDscr.textContent = 'Description:'
        const textDescription = document.createElement('textarea');
        textDescription.setAttribute('id', 'todo-field-description');
        textDescription.setAttribute('placeholder', 'Write here...');
        textDescription.setAttribute('name', 'description');
        textDescription.textContent = description;

        formTODOFieldDscr.appendChild(todoFieldDscr);
        formTODOFieldDscr.appendChild(textDescription);

        const formTODOFieldDate = document.createElement('div');
        formTODOFieldDate.setAttribute('class', 'form-todo-field');
        const todoFieldDate = document.createElement('label');
        todoFieldDate.setAttribute('for', 'todo-field-date');
        todoFieldDate.textContent = 'Date:'
        const inputDate = document.createElement('input');
        inputDate.setAttribute('type', 'date');
        inputDate.setAttribute('id', 'todo-field-date');
        inputDate.setAttribute('required', '');
        inputDate.setAttribute('name', 'date');
        inputDate.value = date;

        formTODOFieldDate.appendChild(todoFieldDate);
        formTODOFieldDate.appendChild(inputDate);

        const formTODOFieldPriority = document.createElement('div');
        formTODOFieldPriority.setAttribute('class', 'form-todo-field');
        const todoFieldPriority = document.createElement('label');
        todoFieldPriority.setAttribute('for', 'todo-field-priority');
        todoFieldPriority.textContent = 'Priority';
        const selectPriority = document.createElement('select');
        selectPriority.setAttribute('id', 'todo-field-priority');
        selectPriority.setAttribute('name', 'priority');
        selectPriority.setAttribute('value', priority);
        selectPriority.setAttribute('required', '');
        const optionLow = document.createElement('option');
        optionLow.setAttribute('value', 'low');
        optionLow.textContent = 'Low';
        const optionMedium = document.createElement('option');
        optionMedium.setAttribute('value', 'medium');
        optionMedium.textContent = 'Medium';
        const optionHigh = document.createElement('option');
        optionHigh.setAttribute('value', 'high');
        optionHigh.textContent = 'High';
        selectPriority.appendChild(optionLow);
        selectPriority.appendChild(optionMedium);
        selectPriority.appendChild(optionHigh);
        selectPriority.value = priority;

        formTODOFieldPriority.appendChild(todoFieldPriority);
        formTODOFieldPriority.appendChild(selectPriority);

        const btnAdd = document.createElement('button');
        btnAdd.setAttribute('class', 'btn-modal-add');
        btnAdd.setAttribute('type', 'submit');
        btnAdd.textContent = 'Accept Changes';

        formTODO.appendChild(formTODOFieldName);
        formTODO.appendChild(formTODOFieldDscr);
        formTODO.appendChild(formTODOFieldDate);
        formTODO.appendChild(formTODOFieldPriority);
        formTODO.appendChild(btnAdd);
        formTODO.addEventListener('submit', function (event) {
            EventHandler.artifactHandler(event, 'todo', id);
            const data = Utils.mainDataFilter();
            const tabType = Storer.currentTabType;
            DOMRenderer.renderMain(data, tabType);
            DOMRenderer.renderCloseModal();
        })

        modalTODOEdit.appendChild(btnClose);
        modalTODOEdit.appendChild(formTODO);

        DOMRenderer.MODALS.appendChild(modalTODOEdit);
    }

    static renderProjectEditModal() {
        DOMRenderer.MODALS.innerHTML = '';
        DOMRenderer.MODALS.style['display'] = 'flex';

        const modalProjectEdit = document.createElement('div');
        modalProjectEdit.setAttribute('class', 'modal-project-edit');

        const btnModalClose = document.createElement('button');
        btnModalClose.setAttribute('class', 'btn-modal-close edit');
        btnModalClose.textContent = 'X';
        btnModalClose.addEventListener('click', () => {
            DOMRenderer.renderCloseModal();
        });

        const formProject = document.createElement('form');
        formProject.setAttribute('class', 'form-project');

        const formProjectField = document.createElement('div');
        formProjectField.setAttribute('class', 'form-project-field');

        const projectLabelName = document.createElement('label');
        projectLabelName.setAttribute('for', 'project-field-name');
        projectLabelName.textContent = 'Project name:';
        const inputProjectName = document.createElement('input');
        inputProjectName.setAttribute('type', 'text');
        inputProjectName.setAttribute('id', 'project-field-name');
        inputProjectName.setAttribute('placeholder', 'Write here...');
        inputProjectName.setAttribute('name', 'name');
        inputProjectName.setAttribute('required', '');

        formProjectField.appendChild(projectLabelName);
        formProjectField.appendChild(inputProjectName);

        const btnAdd = document.createElement('button');
        btnAdd.setAttribute('class', 'btn-modal-add');
        btnAdd.setAttribute('type', 'submit');
        btnAdd.textContent = 'Accept Changes';
        
        formProject.appendChild(formProjectField);
        formProject.appendChild(btnAdd);
        formProject.addEventListener('submit', function (event) {
            EventHandler.artifactHandler(event, 'project');
            DOMRenderer.renderCloseModal();
            const projects = Storer.getItems('project');
            DOMRenderer.renderProjectSidebar(projects);
        })

        modalProjectEdit.appendChild(btnModalClose);
        modalProjectEdit.appendChild(formProject);

        DOMRenderer.MODALS.appendChild(modalProjectEdit);
    }

    static renderNoteEditModal() {
        DOMRenderer.MODALS.innerHTML = '';
        DOMRenderer.MODALS.style['display'] = 'flex';
        
        const modalNoteEdit = document.createElement('div');
        modalNoteEdit.setAttribute('class', 'modal-note-edit');

        const btnClose = document.createElement('button');
        btnClose.setAttribute('class', 'btn-modal-close edit');
        btnClose.textContent = 'X';
        btnClose.addEventListener('click', () => {
            DOMRenderer.renderCloseModal();
        })

        const formNote = document.createElement('form');
        formNote.setAttribute('class', 'form-note');

        const formNoteFieldName = document.createElement('div');
        formNoteFieldName.setAttribute('class', 'form-note-field');

        const noteLabelName = document.createElement('label');
        noteLabelName.setAttribute('for', 'note-field-name');
        noteLabelName.textContent = 'Note name:';
        const inputName = document.createElement('input');
        inputName.setAttribute('type', 'text');
        inputName.setAttribute('id', 'note-field-name');
        inputName.setAttribute('placeholder', 'Write here...');
        inputName.setAttribute('name', 'name');
        inputName.setAttribute('required', '');
        formNoteFieldName.appendChild(noteLabelName);
        formNoteFieldName.appendChild(inputName);

        const formNoteFieldDscr = document.createElement('div');
        formNoteFieldDscr.setAttribute('class', 'form-note-field');
        const noteLabelDscr = document.createElement('label');
        noteLabelDscr.setAttribute('for', 'note-field-description');
        noteLabelDscr.textContent = 'Description:';
        const noteTextAreaDscr = document.createElement('textarea');
        noteTextAreaDscr.setAttribute('id', 'note-field-description');
        noteTextAreaDscr.setAttribute('name', 'description');
        noteTextAreaDscr.setAttribute('placeholder', 'Write here...');
        formNoteFieldDscr.appendChild(noteLabelDscr);
        formNoteFieldDscr.appendChild(noteTextAreaDscr);

        const btnAdd = document.createElement('button');
        btnAdd.setAttribute('class', 'btn-modal-add');
        btnAdd.setAttribute('type', 'submit');
        btnAdd.textContent = 'Accept Changes';


        formNote.appendChild(formNoteFieldName);
        formNote.appendChild(formNoteFieldDscr);
        formNote.appendChild(btnAdd);
        formNote.addEventListener('submit', function (event) {
            EventHandler.artifactHandler(event, 'note');
            const data = Utils.mainDataFilter();
            const tabType = Storer.currentTabType;
            DOMRenderer.renderMain(data, tabType);
            DOMRenderer.renderCloseModal();
        })

        modalNoteEdit.appendChild(btnClose);
        modalNoteEdit.appendChild(formNote);

        DOMRenderer.MODALS.appendChild(modalNoteEdit);
    }
}

export class EventHandler {

    static projectSidebarFilter(event) {
        Storer.projectTabNameSaver(event);
        const data = Storer.getItems('todo');
        const dataProject = Utils.projectFilter(data, Storer.currentTabId)
        return dataProject;
    }


    static projectSidebarDeleter(event) {
        const projectID = event.target.parentElement.id;
        const projectTodos = Storer.getItems('todo').filter(
            (todo) => {return todo.project === projectID}
        );

        console.log(projectTodos)

        for (const projectTodo of projectTodos) {
            Manager.deleter('todo', projectTodo.id);
        }

        Manager.deleter('project', projectID);
        const projects = Storer.getItems('project');

        return projects;
    }

    static menuTabTODOFilter(event) {
        Storer.menuTabSaver(event);
        const tabName = Utils.getClass(event).split(' ').at(1);
        console.log('Tab pulsado: ', tabName)
        if (tabName === 'notes') {
            return
        }
        const data = Storer.getItems('todo');
        const dataFiltered = Utils.todoFilter(data, Storer.currentTabName);
        return dataFiltered;
    }

    static menuTabNotes(event) {
        Storer.menuTabSaver(event);
        const tabName = Utils.getClass(event).split(' ').at(1);
        console.log('Tab pulsado: ', tabName)
        const data = Storer.getItems('note');
        return data;
    }

    static menuTODODeleter(event) {
        const todoID = event.target.parentElement.parentElement.id;
        Manager.deleter('todo', todoID);
        const data = Storer.getItems('todo');
        if (Storer.currentTabType === 'projects') {
            const dataFiltered = Utils.projectFilter(data, Storer.currentTabId);
            console.log(dataFiltered)
            return dataFiltered
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

    static todoData(event, mode) {
        const todoID = event.target.parentElement.parentElement.id;
        console.log(todoID)
        const data = Storer.getItem('todo', todoID);
        try {
            data['mode'] = mode;
            console.log(data)
            return data;
        }

        catch {
            throw new Error('[EventHandler]: No es posible acceder al todo.');
        }
       
    }

    static artifactHandler(event, itemType, id) {
        event.preventDefault();
        const formData = new FormData(event.target);
        let data = {};
        for (const [name, value] of formData) {
            data[name] = value;
        }
        
        data['id'] = id;

        const currentTabType = Storer.currentTabType;
        if (itemType === 'todo') {
            if (currentTabType === 'projects') {
                data['project'] = Storer.currentTabId;
            }
        }
        Manager.editor(itemType, data)
    }

    static checkBoxAlter(event) {
        const checkBox = event.target;
        const todoID = event.target.parentElement.parentElement.id;
        const todo = Storer.getItem('todo', todoID);
        try {
            todo['finalized'] = checkBox.checked;
            Manager.editor('todo', todo);
        }

        catch {
            console.error('[EventHandler]: No es posible acceder al todo.')
        }
        
    }

    static init() {

        DOMRenderer.renderBtns();
        DOMRenderer.renderDate();
        const data = Storer.getItems('todo');
        const tabName = Storer.currentTabName;
        const tabNameFormatted = tabName.at(0).toUpperCase() + tabName.slice(1);
        DOMRenderer.renderTODOS(data, tabNameFormatted);
        const projects = Storer.getItems('project');
        DOMRenderer.renderProjectSidebar(projects);
    }
}