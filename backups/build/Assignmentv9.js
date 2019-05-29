"use strict";
let fun = (f) => ({
    f: f,
    then: function (g) {
        return then(this, g);
    }
});
let then = (f, g) => fun(a => g.f(f.f(a)));
const pick = (keys) => fun(object => keys.map(k => k in object ? { [k]: object[k] } : {})
    .reduce((res, o) => ({ ...res, ...o }), {}));
let getKeys = (object) => Object.keys(object);
const omit = (keys) => fun(object => getKeys(object).map(k => keys.includes(k) ? {} : { [k]: object[k] })
    .reduce((res, o) => ({ ...res, ...o }), {}));
let SelectableObject2 = (data) => null;
let SelectableObject3 = (data, result) => null;
let SelectableObject = function (object, type, result) {
    return {
        object: object,
        // type: type,
        result: result,
        select: function (...entities) {
            const newResult = {};
            entities.forEach(key => { newResult[key] = object[key]; });
            return SelectableObject(newResult, entities.map(entity => entity), entities.map(entity => object[entity]));
        }
    };
};
// Create student en selectable
let student = ({
    Name: 'Jonah',
    Surname: 'Kalkman',
    Grades: [{
            Grade: 10,
            CourseId: 1
        }]
});
let selectableStudent = SelectableObject(student);
let selected = selectableStudent.select('Name').select('Surname');
console.log(selected);
console.log(getKeys(student));
