import "./style.css";

class TODO {

    constructor(id, name, description, date, priority) {
        this.id = id;
        this.finalized = false;
        this.name = name;
        this.description = description;
        this.date = date;
        this.priority = priority
    }

}

class Project {

    constructor(id, name, description, date) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.date = date;
    }

}

class Note {

    constructor(id, name, description) {
        this.id = id;
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