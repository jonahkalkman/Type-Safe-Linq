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
            // let result = this.result == undefined ? selection : this.result = selection;
            // let selection = entities.map(entity => this.object[entity]);
            // let result = this.result === undefined ? selection : this.result.concat(selection);
            var selection = entities.map(function (entity) { return entity; });
            var ret = {};
            entities.forEach(function (key) {
                ret[key] = object[key];
            });
            return SelectableObject(ret, selection);
        }
    };
};
var selectableStudent = SelectableObject(student);
var selected1 = selectableStudent.select(['Name', 'Name']).result;
var selected2 = selectableStudent.select(['Name']).select(['Name']).result;
console.log(selected1);
console.log(selected2);
