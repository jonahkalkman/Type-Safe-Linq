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
            // let result = this.result == undefined ? selection : this.result = selection;
            // let selection = entities.map(entity => this.object[entity]);
            // let result = this.result === undefined ? selection : this.result.concat(selection);
            let selection = entities.map(entity => entity);
            const ret = {};
            entities.forEach(key => {
                ret[key] = object[key];
            });
            return SelectableObject(ret, selection);
        }
    };
};
let selectableStudent = SelectableObject(student);
let selected1 = selectableStudent.select(['Name', 'Name']).result;
let selected2 = selectableStudent.select(['Name']).select(['Name']).result;
console.log(selected1);
console.log(selected2);
