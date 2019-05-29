var student = ({
    Name: 'Jonah',
    Surname: 'Kalkman',
    Grades: [
        {
            Grade: 10,
            CourseId: 1
        }
    ]
});
var SelectableObject = function (object, result) {
    return {
        object: object,
        result: result,
        select: function (entities) {
            // let selection:K[] = entities.map(entity => entity);
            // console.log(selection);
            // let result = this.result == undefined ? selection : this.result = selection;
            // console.log(this.object);
            var selection = entities.map(function (entity) { return entity; });
            return SelectableObject(object, selection);
        }
    };
};
var selectableStudent = SelectableObject(student);
var selected = selectableStudent.select(['Name', 'Surname']).select(['Grades']).result;
console.log(selected);
