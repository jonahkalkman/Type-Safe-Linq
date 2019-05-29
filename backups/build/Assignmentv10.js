"use strict";
let fun = (f) => ({
    f: f,
    then: function (g) {
        return then(this, g);
    }
});
const then = (f, g) => fun(a => g.f(f.f(a)));
const pick = (keys) => fun(object => keys.map(key => key in object ? { [key]: object[key] } : {})
    .reduce((res, o) => ({ ...res, ...o }), {}));
const getKeys = (object) => Object.keys(object);
const omit = (keys) => fun(object => getKeys(object).map(key => keys.includes(key) ? {} : { [key]: object[key] })
    .reduce((res, o) => ({ ...res, ...o }), {}));
// let SelectableObject2 = <a>(data: a): SelectableObject<a, {}> => null!
// let SelectableObjectLinked = <a, b>(data:a, result:b): SelectableObject<a, b> => null!
let SelectableObject = function (object, result) {
    return {
        object: object,
        result: result,
        select: function (...entities) {
            console.log('entities', entities);
            console.log('object', object);
            // ToDo: Pick
            const newResult = pick(entities).f(object);
            console.log('newResult', newResult);
            // ToDo: Bind result and newResult
            // const mergedResult: R & Pick<T, keyof T> = {
            //     ...result,
            //     ...newResult
            // }
            // console.log('mergedResult', mergedResult);
            // ToDo: Omit - DONE - DE HACKY MANIER (keyof T kan misschien anders)
            const newObject = omit(entities).f(object);
            console.log('the new object', newObject);
            return null;
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
// console.log(selected);
// console.log(getKeys(student);
