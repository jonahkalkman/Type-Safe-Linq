"use strict";
// interface Student {
//     Name:string,
//     Surname:string,
//     Grades:[{
//         Grade:number,
//         CourseId:number
//     }]
// }
// type SelectableObject<T, K extends keyof T> = {
//     object: T,
//     // type?: K[],
//     result?: T[K][],
//     select: <K extends keyof T>(entities: K[]) => SelectableObject<Pick<T, K>, K>
// }
// let SelectableObject = function<T, K extends keyof T>(object: T, type?: K[], result?: T[K][]) : SelectableObject<T,K> {
//     return {
//         object: object,
//         // type: type,
//         result: result,
//         select: function<K extends keyof T>(entities: K[]) : SelectableObject<Pick<T, K>, K> {
//             const newResult: any = {};
//             entities.forEach(key => { newResult[key] = object[key] })
//             return SelectableObject(newResult, entities.map(entity => entity), entities.map(entity => object[entity]));
//         }
//     }
// }
// // Create student and selectable Student
// let student: Student = ({
//     Name: 'Jonah',
//     Surname: 'Kalkman',
//     Grades: [{
//         Grade: 10,
//         CourseId: 1
//     }]
// });
// let selectableStudent = SelectableObject(student);
// let selected = selectableStudent.select(['Name']);
// console.log(selected);
