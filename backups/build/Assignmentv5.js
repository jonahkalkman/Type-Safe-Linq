"use strict";
let student = ({
    Name: 'Jonah',
    Surname: 'Kalkman',
    Grades: [
        {
            Grade: 10,
            CourseId: 1
        }
    ]
});
let SelectableObject = function (object, result) {
    return {
        object: object,
        result: result,
        select: function (entities) {
            // let selection:K[] = entities.map(entity => entity);
            // console.log(selection);
            // let result = this.result == undefined ? selection : this.result = selection;
            // console.log(this.object);
            let selection = entities.map(entity => entity);
            return SelectableObject(object, selection);
        }
    };
};
let selectableStudent = SelectableObject(student);
let selected = selectableStudent.select(['Name', 'Surname']).select(['Grades']).result;
console.log(selected);
