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
            var result = this.result;
            var selection = entities.map(function (entity) { return _this.object[entity]; });
            console.log('Result', this.result);
            console.log('Selection', selection);
            return SelectableObject(this.object, this.result = selection.concat(result));
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
var selection1 = selectableStudent.select(['Name']).select(['Surname', 'Test']).select(['Grades']).result;
var selection2 = selectableStudent.select(['Name', 'Surname', 'Grades', 'Test']).result;
console.log('Dit is selectie 1:', selection1);
console.log('Dit is selectie 2:', selection2);
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
