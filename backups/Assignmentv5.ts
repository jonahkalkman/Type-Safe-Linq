interface Student {
    Name:string,
    Surname:string,
    Grades:[
        {
            Grade:number,
            CourseId:number
        }
    ]
}

let student: Student = ({
    Name: 'Jonah',
    Surname: 'Kalkman',
    Grades: [
        {
            Grade: 10,
            CourseId: 1
        }
    ]
});

type SelectableObject<T, K extends keyof T> = {
    object: T,
    result?: K[],
    select:<K extends keyof T>(entities: K[]) =>  SelectableObject<T,K>
}

let SelectableObject = function<T, K extends keyof T>(object: T, result?: K[]) : SelectableObject<T, K> {
    return {
        object: object,
        result: result,
        select:function<K extends keyof T>(entities: K[]): SelectableObject<T,K>{
            // let selection:K[] = entities.map(entity => entity);
            // console.log(selection);
            // let result = this.result == undefined ? selection : this.result = selection;
            // console.log(this.object);
            let selection:K[] = entities.map(entity => entity);
            return SelectableObject(object, selection);
        }
    }
}

let selectableStudent = SelectableObject(student);
let selected = selectableStudent.select(['Name', 'Surname']).select(['Grades']).result;

console.log(selected);