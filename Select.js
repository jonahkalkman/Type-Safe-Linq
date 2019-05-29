var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var fun = function (f) { return ({
    f: f,
    then: function (g) {
        return then(this, g);
    }
}); };
var then = function (f, g) {
    return fun(function (a) { return g.f(f.f(a)); });
};
var pick = function (keys) {
    return fun(function (object) {
        return keys.map(function (key) {
            var _a;
            return key in object ? (_a = {}, _a[key] = object[key], _a) : {};
        })
            .reduce(function (res, o) { return (__assign({}, res, o)); }, {});
    });
};
var getKeys = function (object) { return Object.keys(object); };
var omit = function (keys) {
    return fun(function (object) {
        return getKeys(object).map(function (key) {
            var _a;
            return keys.includes(key) ? {} : (_a = {}, _a[key] = object[key], _a);
        })
            .reduce(function (res, o) { return (__assign({}, res, o)); }, {});
    });
};
// let SelectableObject2 = <a>(data: a): SelectableObject<a, {}> => null!
// let SelectableObjectLinked = <a, b>(data:a, result:b): SelectableObject<a, b> => null!
var SelectableObject = function (object, result) {
    return {
        object: object,
        result: result,
        select: function () {
            var entities = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                entities[_i] = arguments[_i];
            }
            console.log(entities);
            // Do Omit for new object without selected object
            // const keys: any = {};
            // entities.forEach(key => { keys[key] = object[key] })
            //ToDo: zorgen dat entities een object wordt (error is dan weg)
            // const newObject = omit(entities).f(object);
            // console.log(newObject)
            // // ToDo: Pick implementeren
            // const selection = pick(keys).f(object);
            // console.log(selection)
            return null;
        }
    };
};
// Create student en selectable
var student = ({
    Name: 'Jonah',
    Surname: 'Kalkman',
    Grades: [{
            Grade: 10,
            CourseId: 1
        }]
});
var selectableStudent = SelectableObject(student);
var selected = selectableStudent.select('Name');
// console.log(selected);
// console.log(getKeys(student);
