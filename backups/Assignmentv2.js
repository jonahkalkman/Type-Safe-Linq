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
var Student = function (Name, Surname, Test, Grades) { return ({
    Name: Name,
    Surname: Surname,
    Test: Test,
    Grades: Grades
}); };
var SelectableObject = function (object, result) {
    return {
        object: object,
        result: result,
        select: function (entities) {
            var _this = this;
            return SelectableObject(this.object, this.result = __assign({}, this.result, entities.map(function (entity) { return _this.object[entity]; })));
        }
    };
};
var student = ({
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
var selectableStudent = SelectableObject(student);
var selection = selectableStudent.select(['Name']).select(['Surname', 'Test']).result;
var result = selectableStudent.select(['Name', 'Surname']).result;
console.log(selection, result);
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
