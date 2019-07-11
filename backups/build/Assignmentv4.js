"use strict";
let Student = (Name, Surname, Test, Grades) => ({
    Name: Name,
    Surname: Surname,
    Test: Test,
    Grades: Grades
});
let SelectableObject = function (object, result) {
    return {
        object: object,
        result: result,
        select: function (entities) {
            let selection = entities.map(entity => this.object[entity]);
            let result = this.result === undefined ? selection : this.result.concat(selection);
            return SelectableObject(this.object, result);
        }
    };
};
let student = ({
    Name: ['Jonah', 'Robin'],
    Surname: 'Kalkman',
    Test: 'test',
    Grades: [
        {
            Grade: 10,
            CourseId: 1
        }
    ]
});
let selectableStudent = SelectableObject(student);
let selection1 = selectableStudent.select(['Name']).select(['Surname', 'Test']).select(['Grades']).result;
let selection2 = selectableStudent.select(['Name', 'Surname', 'Grades', 'Test']).result;
let selection3 = selectableStudent.select(['Name']).result;
console.log('selection 1', selection1);
console.log('selection 2', selection2);
console.log('selection 3', selection3);
// let incr = Fun((x: number) => x + 1)
// type SelectableEntity<T, K extends keyof T> = T & {
//     select: <K extends keyof T>(this: T, property: K) => T[K]
// }
// function pluck<T, K extends keyof T>(o: T, names: K[]): T[K][] {
//     return names.map(n => o[n]);
// }
// let Selectable = <T>(entity: T): SelectableEntity<T> => ({
//     ...entity,
//     select: function<K extends keyof T>(property: K): T[K] {
//       return Selectable(entity), entity[property]
//     }
// })
// Create a Selectable student
// let selectableStudent = Selectable(student);
// let uitkomst  = selectableStudent.select('Name').select('Surname');