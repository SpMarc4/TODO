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

class Notes {

    constructor(id, name, description, date, priority) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

}

class Storer {

    currentTab

    mapper = {
        'todo': 'todos',
        'project': 'projects',
        'note': 'notes',

    };

    get currentTab() {
        return this.currentTab;
    }

    set currentTab(tab) {
        this.currentTab.push(tab);
    }

    static #updatedList(itemType, item) {
        const itemStorage = this.mapper[itemType];
        const listObj = JSON.parse(localStorage.getItem(itemStorage));
        listObj.push(item);
        return JSON.stringify(listObj);
    }
    
    static saveItem(itemType, item) {

        const itemStorage = this.mapper[itemType];

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
    
    static getItem(itemType, id) {

        try {
            const itemStorage = this.mapper[itemType];

            const listObj = JSON.parse(localStorage.getItem(itemStorage));
            const filteredList = listObj.filter( t => t.id === itemId );

            console.log(`[Storer]: ${itemType} ${id} obtenido correctamente.`);
            return filteredList[0];
        }

        catch {
            console.error(`[Storer]: No se ha podido obtener el ${itemType} ${id}.`);
        }

    }

    static deleteItem(itemType, id) {

        try {
            const itemStorage = this.mapper[itemType];

            const listObj = JSON.parse(localStorage.getItem(itemStorage));
            const filteredList = JSON.stringify(
                listObj.filter(
                    t => t.id !== itemId
                )
            );

            localStorage.setItem(itemStorage, filteredList);
        
            console.log(`[Storer]: ${itemType} ${id} eliminado correctamente.`);
        }

        catch {
            console.error(`[Storer]: No se ha podido eliminar el ${itemType} ${id}.`);
        }

    }

    static getItems(itemType) {
        const itemStorage = this.mapper[itemType];

        try {
            console.log(`[Storer]: ${itemStorage} obtenidos correctamente.`);
            return JSON.parse(localStorage.getItem(itemStorage));
        }

        catch{
            console.error(`[Storer]: No se han podido obtener los ${itemStorage}.`);
        }

    }
}