# Plan de desarrollo

Este documento sirve como guía personal para el desarrollador, sirve para tener en cuenta los requisitos de proyecto y listar todos lo necesario para implementarlo.

## Requisitos especificádos en The Odin Project

1- Los 'todos' deben ser objetos creados dinámicamente [Usar clases].
2- Propiedades mínimas del 'todo'
    - Título
    - Descripción
    - Fecha de ejecución
    - Prioridad
3- Otros elementos notas y checklist.
4- Los todos pueden ir en proyectos o separados. También cuando el usuario abra la app le aparecerán proyectos y todos default.
5- Separar lógica de aplicación con lógica de DOM en módulos diferentes
6- La interfaz debe contener:
    - Todos los proyectos
    - Ver todos los 'todos' en cada proyecto
    - Expandir individualmente cada todo para ver/editar los detalles.
    - Eliminar un todo.
7- Usar webpack como bundle.
    - Usar la librería date-fns
8- Usar localStorage de la API Web Storage API para persistir datos.
    - La app no debe crashear si los datos de localStorage no se encuentra
    - Se ha de utilizar formato string JSON para envíar datos, es el formato del cual se deberían recibir.

## Configuración

- Utilizar package.json para instalar dependencias de usuario y desarrollador.
- Utilizar webpack como:
    - bundler
    - Uso de scripts.
    - Modo desarrollador y build.
    - Revisar The Odin Project anterior para cuando se publique en GitHub la página.

## Propuesta de interfaz

1- Background:
    -Fondo con imagen similar a una mesa de trabajo.
2- Main Layout:
    -Recuadro dónde se contendrá verdaderamente la app.
    -Contiene cada una de las pestañas. 
3- Header:
    - Título del proyecto: TODO List.
4- Sidebar para que el usuario escoja entre las siguientes opciones:
    - TODOS: Botón que permite navegar a la pestaña TODOS.
    - Today: Botón que permite navegar a la pestaña Today.
    - Week: Botón que permite navegar a la pestaña Week.
    - Projects: Desplegable que contiene todos los proyectos creados.
    - Cada uno de los proyectos: Dentro del desplegable de proyecto, contiene un botón por proyecto que permite navegar a la pestaña del proyecto y un botón de eliminar. 
    - Notes: Botón que permite navegar a la pestaña Notes.
    - Create: Botón que abre una modal para crear TODO, Proyecto o Nota.
5- Footer:
    - Fecha actual en segundos.

Pestañas:
    - TODOS: Será una pestaña que contendrá todos los TODOS definidos.
    - Today: Pestaña idéntica a TODOS pero filtrados por el día de hoy.
    - Week: Pestaña idéntica a TODOS pero con los todos filtrados por semana actual.
    - Pestaña de proyectos: Pestaña idéntica a TODOS pero con los todos filtrados por el proyecto escogido.
    - Notas: Contiene todas las notas creadas.

TODO:
Contiene 3 interfaces:
    - Comprimida: La que aparece en las pestañas, contiene:
        - Prioridad, Checkbox, Nombre, botón detalle, Fecha, botón editar y botón eliminar.
    - Expandida: La que aparece al clicar en detalles. Te muestra todas las propiedades que has definido del TODO en formato modal.
    - Crear/Editable: Modal que permite definir un título, descripción, fecha, prioridad y botón de añadir/confirmar edición.

Proyecto:
Contiene 2 interfaces:
    - Se muestra el nombre y un botón editar para renombrarlo.
    - Modal con la opción de escribir un título y con un botón de crear proyecto.

Nota:
Contiene 3 interfaces:
    - Notas que aparecen en la pestaña, como objeto con título, descripción y botón de eliminar.
    - Modal con la opción de escribir un título, detalles y con un botón de crear proyecto.
    - Modal con la opción de editar título, detalles y con un botón de confirmar edición.

## DOM

- La propuesta es crear un archivo html global y para cada pestaña un contenedor que se haga visible cuando se clicke cada una o renderizar todo para que haya solo los objetos necesarios.
- Utilizar un render, para actualizar el DOM según el botón clicado.
- Cada página tendrá su propio render.
- Utilizar modales:
    - Cuando se pulsa crear. En este caso el proyecto, todo y note, no serán htmls individuales, irán con un TODO.
    - Cuando se pulsa editar en:
        - TODO.
        - Note.

## Lógica

Separar la lógica por objetos:

Elementos:
    - TODO
    - Proyectos
    - Notas

DOM:
    - Renderer

Flujo:
    - Controller, dirige las acciones del ususario

Almacenamiento:
    - Storer, utilizando el localStore y que se encargue de crear, editar y eliminar elementos.

## Acciones

Clase TODO:
    - Propiedades:
        - ID único: string -> Lo gestiona el browser.
        - Finalizado: booleano -> No se introduce por el usuario, viene false por default
        - Nombre: string
        - Descripción ? opcional: string
        - Fecha: datetime
        - Prioridad: string -> low | medium | high
        - Proyecto al que pertenece (Id): string -> Lo gestiona el browser

    -Método:
        - setter config
        - getter config
        - generador de id -> Quizás se debe extraer como método genérico

Clase Project
    - Propiedades:
        - ID único: string -> Lo genera el browser.
        - Nombre: string
        - Descripción ? opcional: string
        - Fecha: datetime

    -Método:
        - setter config
        - getter config
        - generador de id -> Quizás se debe extraer como método genérico

Clase Notes
    - Propiedades:
        - ID único: string -> Lo genera el browser.
        - Nombre: string
        - Descripción: string

    -Método:
        - setter config
        - getter config
        - generador de id -> Quizás se debe extraer como método genérico


Clase Storer
    - Propiedades:
        - Listado TODO's: Array<string> (id)
        - Listado Projects: Array<string> (id)
        - Listado Notes: Array<string> (id)
        - Current Tab: <'Project Id'> Si estás en la pestaña de un  proyecto, <'Nombre del Tab'> si no lo estás

    - Métodos:
        - getter & setter TODO's
        - getter & setter Projects
        - getter & setter Notes
        - getter & setter class current tab -> Clase

Clase Utils
    - Propiedades:
        - ...
    
    - Métodos:
        - generateID: Generador de ID's
        - getID: Obtener ID's elementos clicados
        - getClass: Obtener clase elementos clicados
        - getFormInfo


Clase Manager
    - Propiedades:
        - ...
    
    - Métodos:
        - TODO Creator: Genera ID, Crea objeto TODO y lo añade al Storer
        - Project Creator: Genera ID,Crea objeto Project y lo añade al Storer
        - Note Creator: Genera ID,Crea objeto Note y lo añade al Storer
        - TODO Deleter: Obtiene ID, Elimina objeto TODO del Storer
        - Project Deleter: Obtiene ID, Elimina objeto TODO del Storer
        - Note Creator: Obtiene ID, Elimina objeto Note del Storer
        - TODO Editor: Obtiene ID, modifica el estado

        - Editor: Le pasas como parámetro el ID y si es project, note o todo, si existe lo edita si no lo crea.
        - Deleter: Le pasas como parámetro el ID y si es project, note o todo y lo elimina.

Clase DOM Render
    - Propiedades:
        - ...
    
    - Métodos

        - createProjectSidebar(id, name) -> Datos necesario para renderizar en Main
        - createTodo(id, name, state, date,) -> Datos necesario para renderizar en Main
        - createNote(id, name, description) -> Datos necesario para renderizar en Main

        - renderHeader
        - renderSidebar
        - renderMain(idTab)
        - renderFooter

        - renderLayout()

        - renderModalTodoEdit
        - renderModalTodoInfo
        - renderModalProjectEdit
        - renderModalNoteEdit

        - renderTodos -> Coge los elementos del storer, los crea y los añade a Main
        - renderTodosToday ->
        - renderTodosWeek ->
        - renderProjects(id) -> Coge los elementos del storer, los crea y los añade a Main
        - renderNotes -> Coge los elementos del storer, los crea y los añade a Main

        - render(element) -> Tiene un modo de renderización por clase para todas las vista y otro para proyectos por id

element: {
    item: 
        | artifact:
            name: todo | project | note,
        | view: 
            | layout: 'header' | 'sidebar' | 'main' | 'footer' | 'modal',
            | modal: 'create' | 'todo'| 'todo-info' | 'project' | 'note',
    
    id: <idArtifact> | <classView> | projectView,

    todo-info?: { name, description, date, priority }

}

currentTab -> <classView>: clase TODO | clase TODAY | clase WEEK | <ProjectID>

ID único: string -> Lo gestiona el browser.
        - Finalizado: booleano -> No se introduce por el usuario, viene false por default
        - Nombre: string
        - Descripción ? opcional: string
        - Fecha: datetime
        - Prioridad: string -> low | medium | high
        - Proyecto al que pertenece (Id): string -> Lo gestiona el browser

Clase Emitter -> Se añadirá un event listener al crear cada botón, a ese evento se le adjundar un send(message) dónde message: { command, data }
    - Propiedades:
        - ...
    
    - send: Envía mensajes con datos
        - sendInit: {
            { command: 'init' }
            
        }
        - sendSwitchTab: {
            getClass
            if project
            getID
            id: class | { project: id }
            { command: 'switch-tab', element: { item:view:layout: 'main' }, id }
        }
        - sendCreateArtifact: { command: 'create-artifact', { element: { item:view:modal: 'create', id: <idTab> }} }
        
        - sendCreateTodo: { command: 'create-todo', element: { item:view:modal: 'todo', id: <idTab> } }
        - sendAcceptTodo: { 
            command: 'accept-todo',
            data: { name, description?, date, priority },
            element: { item:view:layout: 'main', id: <idTab> }
        }
        - sendEditTodo: { command: 'edit-todo', element: { item:view:modal:'todo', id: <idTab> } }
        - sendFinalizeTODO: { command: 'finalize-todo', { 
            data: { id: <idArtifact> },
            element: { item:view:layout:'main', id: <idTab> }
         }}
        - sendDeleteTodo: { command: delete-todo, 
            data: { id: <idArtifact> },
            element: { item:view:layout:'main', id: <idTab> }
        }
        - sendInfoTodo: { command: info-todo,
            data: { id: <idArtifact> } },
            element: { item:view:modal:'todo-info', id: <idTab>, todo-info: { name, description, date, priority }
        }
        
        - sendChangeTodo: { command: change-todo-state,
            data: { id },
            element: { item:view:layout:'main', id: <idTab> }
        
        }
        
        - sendCreateProject: { command: create-project, element: { item:view:modal: 'project', id: <idTab> }}
        - sendAcceptProject: { command: accept-project,
            data: { name, description? }
            element: { item:view:layout: 'main, id: <idTab> }
        }
        - sendDeleteProject: { command: delete-project,
            data: { id: <idArtifact> },
            element: { item:view:layout:'main', id: <idTab> }
        }
        
        - sendCreateNote: { command: create-note, element: { item:view:modal: 'note', id: <idTab>  }}
        - sendAcceptNote: { command: accept-note,
            data: { name, description? }
            element: { item:view:layout:'main', id: <idTab> }
        }

        - sendDeleteNote: { command: delete-note,
            data: { id },
            element: { item:view:layout:'main', id: <idTab> }
        }
        
        - sendCloseModal: { command: close-modal,
            element: { item:view:layout:'main', id: <idTab> }
        }


## Pendiente

Clase Listener/Orquestator

    - Propiedades:
        - ...

    - Métodos:
        - execute(message):
            - init:
                - setter IDCurrentTab -> clase TODO
                - renderLayout()

            - switch-tab:
                - setter ClassCurrentTab
                - render(element: { item.view.layout, id: <idTab> })

            - create-artifact:
                - render(element.item.view.modal, element.id)

            - create-todo:
                - render(element.item.view.modal, element.id)

            - accept-todo:
                - generateID
                - editor('todo', <id>, data= {
                            id, name, description?, date, priority, finalized
                        }
                    )
                - render(element.item.view.layout, element.id)

            - edit-todo:
                - render(element.item.view.modal, element.id, todo-info)

            - finalize-todo:
                - getter Storer Todo
                - setter Storer
                - render(element.item.view.layout, element.id)

            - delete-todo:
                - deleter('todo', <id>)
                - render(element.item.view.layout, element.id)

            - info-todo:
                - render(element.item.view.layout, element.id, todo-info)

            - change-todo:
                - getter Storer Todo
                - setter Storer
                - render(element.item.view.layout, element.id)

            - create-project:
                - render(element.item.view.layout, element.id)

            - accept-project:
                - generateID
                - editor('project', <id>, data= {
                            id, name, description?
                        }
                    )
                - render('main', <current-tab>)

            - delete-project:
                - deleter('project', <id>)
                - render('main', <current-tab>)

            - create-note:
                - render(element.item.view.layout, element.id)
                
            - accept-note:
                - generateID
                - creator('note', <id>, data= {
                            id, name, description?
                        }
                    )
                - render(element.item.view.layout, element.id)

            - delete-note:
                - deleter('note', <id>)
                - render(element.item.view.layout, element.id)

            - close-modal:
                - render(element.item.view.layout, element.id)
