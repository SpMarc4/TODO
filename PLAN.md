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
        - getter & setter ID current tab

Clase Utils
    - Propiedades:
        - ...
    
    - Métodos:
        - Generador de ID's
        - Obtener ID's elementos clicados
        - Obtener clase elementos clicados


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
        - Creator: Le pasas como parámetro el ID y si es project, note o todo y lo crea.
        - Deleter: Le pasas como parámetro el ID y si es project, note o todo y lo elimina.

Clase DOM Render
    - Propiedades:
        - ...
    
    - Métodos
        - renderHeader
        - renderSidebar
        - renderMain(idTab)
        - renderFooter
        - createProjectSidebar(id, name) -> Datos necesario para renderizar en Main
        - createTodo(id, name, state, date,) -> Datos necesario para renderizar en Main
        - createNote(id, name, description) -> Datos necesario para renderizar en Main
        - renderTodos -> Coge los elementos del storer, los crea y los añade a Main
        - renderProjects -> Coge los elementos del storer, los crea y los añade a Main
        - renderNotes -> Coge los elementos del storer, los crea y los añade a Main
        - renderModalTodoEdit
        - renderModalTodoInfo
        - renderModalProjectEdit
        - renderModalNoteEdit
        - renderModal(artifact, type)


        - render(element, idTab? ,artifact?, type?, idArtifact?)

element: header | sidebar | main | footer | modal
idTab: <id>
artifact: todo | project | note
modal: create | todo | todo-info | project | note
idArtifact: <id>

Clase Emitter -> Se añadirá un event listener al crear cada botón, a ese evento se le adjundar un send(message) dónde message: { command, data }
    - Propiedades:
        - ...
    
    - send: Evía mensajes con datos
        - { command: init }
        - { command: switch-tab, data: { tab-id } }
        - { command: create-artifact, data: { artifact-name } }
        
        - { command: create-todo }
        - { 
            command: accept-todo,
            data: { id, name, description?, date, priority, finalized }
        }
        - { command: edit-todo, data: { id } }
        - { command: delete-todo, data: { id } }
        - { command: info-todo, data: { id } }
        
        - { command: create-project }
        - { command: accept-project, data: { id, name, description? } }
        - { command: delete-project, data: { id } }
        
        - { command: create-note }
        - { command: accept-note, data: { id, name, description? } }
        - { command: delete-note, data: { id } }
        
        - { command: close-modal, data: { id } }


## Pendiente

Clase Listener/Orquestator

    - Propiedades:
        - ...

    - Métodos:
        - execute(message):
            - init:
                - render('init')
                - setter IDCurrentTab

            - switch-tab:
                - utils.getTabID
                - setter IDCurrentTab
                - render('main', tab-id)

            - create-artifact:
                - render('modal', '', '', 'create')

            - create-todo:
                - render('modal', '', 'todo', 'todo')

            - accept-todo:
                - creator('todo', <id>, data= {
                            id, name, description?, date, priority, finalized
                        }
                    )
                - close-modal

            - edit-todo:
                - render('modal', '', 'todo', 'todo')

            - delete-todo:
                - deleter('todo', <id>)
                - utils.getTabID
                - render('main', <current-tab>)

            - info-todo:
                - render('modal', <id>, 'todo', 'todo-info')

            - create-project:
                - render('modal', '', 'project', 'project')

            - accept-project:

                - creator('project', <id>, data= {
                            id, name, description?
                        }
                    )
                - utils.getTabID
                - render('main', <current-tab>)

            - delete-project:
                - deleter('project', <id>)
                - utils.getTabID
                - render('main', <current-tab>)

            - create-note:
                - render('modal', '', 'note', 'note')
                
            - accept-note:
                - creator('note', <id>, data= {
                            id, name, description?
                        }
                    )
                - utils.getTabID
                - render('main', <current-tab>)

            - delete-note:
                - deleter('note', <id>)
                - utils.getTabID
                - render('main', <current-tab>)

            - close-modal:
                - render('main', <current-tab>)
