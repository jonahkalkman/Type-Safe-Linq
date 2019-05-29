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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var Student = function (Name, Surname, Grades) { return ({
    Name: Name,
    Surname: Surname,
    Grades: Grades
}); };
var Selectable = function (entity) { return (__assign({}, entity, { select: function (property) {
        return Selectable(entity), entity[property];
    } })); };
var student = ({
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
var selectableStudent = Selectable(student);
var uitkomst = selectableStudent.select('Name');
console.log(uitkomst);
// console.log(nameAndSurnameOnly)
