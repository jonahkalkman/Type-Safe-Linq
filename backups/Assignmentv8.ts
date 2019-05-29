interface Student {
    Name:string,
    Surname:string,
    Grades:[{
        Grade:number,
        CourseId:number
    }]
}

let student: Student = ({
    Name: 'Jonah',
    Surname: 'Kalkman',
    Grades: [{
        Grade: 10,
        CourseId: 1
    }]
});

type SelectableObject<T, K extends keyof T> = {
    object: T,
    type?: K[],
    result?: T[K],
    select: <K extends keyof T>(...entities: K[]) => SelectableObject<Pick<T, K>, K>
}

let SelectableObject = function<T, K extends keyof T>(object: T, type?: K[], result?: T[K]) : SelectableObject<T,K> {
    return {
        object: object,
        type: type,
        result: result,
        select: function<K extends keyof T>(...entities: K[]) : SelectableObject<Pick<T, K>, K> {
            // let result = this.result == undefined ? selection : this.result = selection;
            // let selection = entities.map(entity => this.object[entity]);
            // let result = this.result === undefined ? selection : this.result.concat(selection);
            let selectionType: K[] = entities.map(entity => entity);
            let selectionResult = entities.map(entity => object[entity]);
            const newResult: any = {};
            entities.forEach(key => {
                newResult[key] = object[key];
            })
            return SelectableObject(newResult, selectionType, selectionResult);
        }
    }
}

let selectableStudent = SelectableObject(student);
let selected = selectableStudent.select('Name', 'Grades').select('Name').result;

console.log(selected);

// let selected: SelectableObject<Pick<Pick<Student, "Name" | "Grades">, "Grades">, "Grades">
//
// pick van student naar name | grades, dan pick van (pick van student naar name | grades)
// met returntype grades. En dan heb je een selectable object van
// pick(grades(pick van student naar name | grades)) met returntype grades