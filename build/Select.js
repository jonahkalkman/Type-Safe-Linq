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
let SelectableObject = function (object, result) {
    return {
        object: object,
        result: result,
        select: function (...entities) {
            // Pick result
            const newResult = pick(entities).f(object);
            // Omit object
            const newObject = omit(entities).f(object);
            // Merge result
            const mergedResult = Object.assign({}, result, newResult);
            return SelectableObject(newObject, mergedResult);
        },
        include: function (entity, query) {
            // Push entity: K into an Array: Array<K>
            const entityArray = [];
            entityArray.push(entity);
            // Create a new object without entity: K
            const newObject = omit(entityArray).f(object);
            // Get childs from entity: K & move into array
            const allKeysFromEntity = object[entity][0];
            // Create selectableObject for query with allKeysFromEntity as object: T
            const selectableEntity = SelectableObject(allKeysFromEntity);
            // Get result from query with selectableEntity
            const newResult = query(selectableEntity).result;
            // Merge old with new result
            const mergedResult = Object.assign({}, result, newResult);
            return SelectableObject(newObject, mergedResult);
        }
    };
};
let student = ({
    Name: 'Jonah',
    Surname: 'Kalkman',
    Grades: [{
            Grade: 10,
            CourseId: 1
        }],
    Test: [{
            test1: 'test1value',
            test2: 'test2value'
        }]
});
let selectableStudent = SelectableObject(student);
let selection = selectableStudent.select('Name').include('Grades', q => q.select('CourseId')).result;
console.log('selection', selection);
