import "./style.css";

const form = document.querySelector('form');
const btnModal = document.querySelector('.btn-modal-add');

class TODO {

    constructor(name, description, date, priority) {
        this.id = Utils.generateID();
        this.finalized = false;
        this.name = name;
        this.description = description;
        this.date = date;
        this.priority = priority
    }

}

class Project {

    constructor(name, description) {
        this.id = Utils.generateID();
        this.name = name;
        this.description = description;
    }

}

class Note {

    constructor(name, description) {
        this.id = Utils.generateID();
        this.name = name;
        this.description = description;
    }

}

class Storer {

    static currentTab

    static mapper = {
        'todo': 'todos',
        'project': 'projects',
        'note': 'notes',

    };

    get currentTab() {
        return Storer.currentTab;
    }

    set currentTab(tab) {
        Storer.currentTab.push(tab);
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
            const filteredList = JSON.stringify(
                listObj.filter(
                    t => t.id !== itemId
                )
            );

            const itemsFound = listObj.filter(
                t => t.id === itemId
            )

            if (itemsFound.length < 1) {
                console.log(`[Storer]: Id no encontrado ${itemId}. Asegurese del formato.`)
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

class Utils {

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
            return data
            console.log(`[Utils] Formateo de los datos correcto`)
        }

        catch {
            console.Error(`[Utils] No se han podido formatear los datos correctamente.`)
            
        }
    }
}

class Manager {

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

// form.addEventListener('submit', function (event) {
//         return Utils.getFormInfo(event, this.elements)
//     }
    
// )