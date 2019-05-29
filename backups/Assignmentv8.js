var student = ({
    Name: 'Jonah',
    Surname: 'Kalkman',
    Grades: [{
            Grade: 10,
            CourseId: 1
        }]
});
var SelectableObject = function (object, type, result) {
    return {
        object: object,
        type: type,
        result: result,
        select: function () {
            var entities = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                entities[_i] = arguments[_i];
            }
            // let result = this.result == undefined ? selection : this.result = selection;
            // let selection = entities.map(entity => this.object[entity]);
            // let result = this.result === undefined ? selection : this.result.concat(selection);
            var selectionType = entities.map(function (entity) { return entity; });
            var selectionResult = entities.map(function (entity) { return object[entity]; });
            var newResult = {};
            entities.forEach(function (key) {
                newResult[key] = object[key];
            });
            return SelectableObject(newResult, selectionType, selectionResult);
        }
    };
};
var selectableStudent = SelectableObject(student);
var selected = selectableStudent.select('Name', 'Grades').select('Name').result;
console.log(selected);
// let selected: SelectableObject<Pick<Pick<Student, "Name" | "Grades">, "Grades">, "Grades">
//
// pick van student naar name | grades, dan pick van (pick van student naar name | grades)
// met returntype grades. En dan heb je een selectable object van
// pick(grades(pick van student naar name | grades)) met returntype grades
