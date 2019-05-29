"use strict";
// interface Student {
//   Name:string,
//   Surname:string
//   // Grades:[
//   //   {
//   //     Grade:number,
//   //     CourseId:number
//   //   }
//   // ]
// }
let Student = (Name, Surname, Grades) => ({
    Name: Name,
    Surname: Surname,
    Grades: Grades
});
let Selectable = (entity) => ({
    ...entity,
    select: function (property) {
        return Selectable(entity), entity[property];
    }
});
let student = ({
    Name: 'test',
    Surname: 'est',
    Grades: [
        {
            Grade: 10,
            CourseId: 10
        }
    ]
});
// // From T pick a set of properties K
// declare function pick<T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K>;
// const nameAndSurnameOnly = pick(student, "Name", "Surname");  // { name: string, age: number }
// type Picked = Pick<Student, 'Name' | 'Surname'>
let selectableStudent = Selectable(student);
let uitkomst = selectableStudent.select('Name');
console.log(uitkomst);
// console.log(nameAndSurnameOnly)
