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
    select:<K extends keyof T>(entities: K[]) =>  SelectableObject<Pick<T, K>, K>
}

let SelectableObject = function<T, K extends keyof T>(object: T, result?: K[]) : SelectableObject<Pick<T, K>, K> {
    return {
        object: object,
        result: result,
        select:function<K extends keyof T>(entities: K[]): SelectableObject<Pick<T, K>, K> {
            // let result = this.result == undefined ? selection : this.result = selection;
            // let selection = entities.map(entity => this.object[entity]);
            // let result = this.result === undefined ? selection : this.result.concat(selection);
            let selection:K[] = entities.map(entity => entity);
            const ret: any = {};
            entities.forEach(key => {
                ret[key] = object[key];
            })
            return SelectableObject(ret, selection);
        }
    }
}

let selectableStudent = SelectableObject(student);
let selected1 = selectableStudent.select(['Name', 'Name']).result;
let selected2 = selectableStudent.select(['Name']).select(['Name']).result;

console.log(selected1);
console.log(selected2);