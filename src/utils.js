import { format, parseISO, getISOWeek, getISOWeekYear } from "date-fns";

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

    static todoFilter(data, type) {

        switch (type) {
            case 'today': {
                return data.filter(
                    function (todo) {
                        if (!todo.date) {
                            return false
                        }
                        const currentDate = format(new Date(), 'dd-MM-yyyy');
                        const todoDate = format(parseISO(todo.date), 'dd-MM-yyyy');
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