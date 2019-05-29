"use strict";
let Student = (Name, Surname, Test, Grades) => ({
    Name: Name,
    Surname: Surname,
    Test: Test,
    Grades: Grades
});
let SelectableObject = function (object) {
    return {
        object: object,
        select: function (object, names) {
            return names.map(n => object[n]);
        }
    };
};
let student = ({
    Name: 'Jonah',
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
let test = selectableStudent.select(student, ['Name', 'Surname', 'Grades', 'Test']);
console.log(test);
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
