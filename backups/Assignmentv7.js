var student = ({
    Name: 'Jonah',
    Surname: 'Kalkman',
    Grades: [{
            Grade: 10,
            CourseId: 1
        }]
});
var SelectableObject = function (object, result) {
    return {
        object: object,
        result: result,
        select: function (entities) {
            // let result = this.result == undefined ? selection : this.result = selection;
            // let selection = entities.map(entity => this.object[entity]);
            // let result = this.result === undefined ? selection : this.result.concat(selection);
            var selection = entities.map(function (entity) { return entity; });
            var newResult = {};
            entities.forEach(function (key) {
                newResult[key] = object[key];
            });
            return SelectableObject(newResult, selection);
        }
    };
};
var selectableStudent = SelectableObject(student);
var selected = selectableStudent.select(['Name', 'Grades']).select(['Name']).result;
// let selected: SelectableObject<Pick<Pick<Student, "Name" | "Grades">, "Grades">, "Grades">
// pick van student naar name | grades, dan pick van (pick van student naar name | grades) met returntype grades. En dan heb je een selectable object van pick(grades(pick van student naar name | grades)) met returntype grades
console.log(selected);
