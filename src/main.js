import { Utils } from "./utils.js";
import { TODO, Project, Note } from "./artifacts.js";

export class Storer {
  static currentTabId = "";
  static currentTabName = "todos"; // todos | today | week | notes
  static currentTabType = "todos"; // todos | projects | notes

  static mapper = {
    todo: "todos",
    project: "projects",
    note: "notes",
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

  static #updatedList(itemType, item, mode) {
    const itemStorage = Storer.mapper[itemType];
    let newListObj = [];
    const listObj = JSON.parse(localStorage.getItem(itemStorage));

    if (mode === "create") {
      listObj.push(item);
      newListObj = listObj;
      return JSON.stringify(newListObj);
    } else if (mode === "edit") {
      newListObj = listObj.map((object) =>
        object.id === item.id ? item : object,
      );
      return JSON.stringify(newListObj);
    }

    throw new Error("[Storer] No se puede actualizar la lista.");
  }

  static #itemChecker(itemType) {
    if (!Storer.mapper.hasOwnProperty(itemType)) {
      throw new Error(
        `[Storer]: Item incorrecto. Seleccione uno entre: todo, project o note.`,
      );
    }
  }

  static #typeItemChecker(itemType, item) {
    if (itemType === "todo") {
      if (item instanceof TODO) {
        return;
      } else {
        throw new Error(
          `[Storer]: Clase del item incorrecta. Asegúrese que sea un TODO`,
        );
      }
    } else if (itemType === "project") {
      if (item instanceof Project) {
        return;
      } else {
        throw new Error(
          `[Storer]: Clase del item incorrecta. Asegúrese que sea un Project`,
        );
      }
    }

    if (itemType === "note") {
      if (item instanceof Note) {
        return;
      } else {
        throw new Error(
          `[Storer]: Clase del item incorrecta. Asegúrese que sea una Note`,
        );
      }
    }
  }

  static saveItem(itemType, item, mode = "create") {
    Storer.#itemChecker(itemType);
    if (mode === "create") {
      Storer.#typeItemChecker(itemType, item);
    }

    const itemStorage = Storer.mapper[itemType];

    if (!localStorage.getItem(itemStorage)) {
      localStorage.setItem(itemStorage, JSON.stringify([]));
    }

    try {
      const listStr = Storer.#updatedList(itemType, item, mode);
      localStorage.setItem(itemStorage, listStr);
      console.log(`[Storer]: ${itemType} almacenado correctamente.`);
    } catch {
      console.error(`[Storer]: No se ha podido almacenar el ${itemType}.`);
    }
  }

  static getItem(itemType, itemId) {
    Storer.#itemChecker(itemType);

    try {
      const itemStorage = Storer.mapper[itemType];

      const listObj = JSON.parse(localStorage.getItem(itemStorage));
      const filteredList = listObj.filter((t) => t.id === itemId);

      if (filteredList.length < 1) {
        return;
      }

      console.log(`[Storer]: ${itemType} ${itemId} obtenido correctamente.`);
      return filteredList[0];
    } catch {
      console.error(
        `[Storer]: No se ha podido obtener el ${itemType} ${itemId}.`,
      );
    }
  }

  static deleteItem(itemType, itemId) {
    Storer.#itemChecker(itemType);

    try {
      const itemStorage = Storer.mapper[itemType];

      const listObj = JSON.parse(localStorage.getItem(itemStorage));
      const itemsFound = listObj.filter(function (t) {
        return t.id === itemId;
      });
      const filteredList = JSON.stringify(
        listObj.filter((t) => t.id !== itemId),
      );

      if (itemsFound.length < 1) {
        console.log(
          `[Storer]: Id no encontrado ${itemId}. Asegúrese del formato.`,
        );
        return;
      }

      localStorage.setItem(itemStorage, filteredList);

      console.log(`[Storer]: ${itemType} ${itemId} eliminado correctamente.`);
    } catch {
      console.error(
        `[Storer]: No se ha podido eliminar el ${itemType} ${itemId}.`,
      );
    }
  }

  static getItems(itemType) {
    Storer.#itemChecker(itemType);

    const itemStorage = Storer.mapper[itemType];

    try {
      const itemArray = JSON.parse(localStorage.getItem(itemStorage))
        ? JSON.parse(localStorage.getItem(itemStorage))
        : [];
      console.log(`[Storer]: ${itemStorage} obtenidos correctamente.`);
      return itemArray;
    } catch {
      console.error(`[Storer]: No se han podido obtener los ${itemStorage}.`);
      const itemStorage = Storer.mapper[itemType];
      localStorage.removeItem(itemStorage);
      return [];
    }
  }

  static projectTabNameSaver(event) {
    const projectID = event.target.parentElement.id;
    const projectName = event.target.textContent;
    Storer.currentTabId = projectID;
    Storer.currentTabName = projectName;
    Storer.currentTabType = "projects";
  }

  static menuTabSaver(event) {
    const tabID = "";
    const tabName = Utils.getClass(event).split(" ").at(1);
    Storer.currentTabId = tabID;
    Storer.currentTabName = tabName;
    if (tabName === "notes") {
      Storer.currentTabType = "notes";
    } else {
      Storer.currentTabType = "todos";
    }
  }
}

export class Manager {
  static #todoEditor(data) {
    if (!data.id) {
      const todo = new TODO(
        data.name,
        data.description,
        data.date,
        data.priority,
        data.project ? data.project : null,
      );

      Storer.saveItem("todo", todo, "create");
      return;
    }

    const oldTodo = Storer.getItem("todo", data.id);

    oldTodo.id = data.id;
    oldTodo.name = data.name;
    oldTodo.date = data.date;
    oldTodo.description = data.description;
    oldTodo.priority = data.priority;
    if (data.finalized !== undefined) oldTodo.finalized = data.finalized;

    Storer.saveItem("todo", oldTodo, "edit");
  }

  static #projectCreator(data) {
    const project = new Project(data.name, data.description);

    Storer.saveItem("project", project);
  }

  static #noteCreator(data) {
    const note = new Note(data.name, data.description);

    Storer.saveItem("note", note);
  }

  static editor(itemType, data) {
    switch (itemType) {
      case "todo":
        Manager.#todoEditor(data);
        break;

      case "project":
        Manager.#projectCreator(data);
        break;

      case "note":
        Manager.#noteCreator(data);
        break;
    }
  }

  static deleter(itemType, itemId) {
    Storer.deleteItem(itemType, itemId);
  }
}
