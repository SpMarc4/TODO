import { Utils } from './utils.js';

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