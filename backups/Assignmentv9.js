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
var fun = function (f) {
    return ({
        f: f,
        then: function (g) {
            return then(this, g);
        }
    });
};
var then = function (f, g) {
    return fun(function (a) { return g.f(f.f(a)); });
};
var pick = function (keys) {
    return fun(function (object) {
        return keys.map(function (k) {
            var _a;
            return k in object ? (_a = {}, _a[k] = object[k], _a) : {};
        })
            .reduce(function (res, o) { return (__assign({}, res, o)); }, {});
    });
};
var getKeys = function (object) { return Object.keys(object); };
var omit = function (keys) {
    return fun(function (object) {
        return getKeys(object).map(function (k) {
            var _a;
            return keys.includes(k) ? {} : (_a = {}, _a[k] = object[k], _a);
        })
            .reduce(function (res, o) { return (__assign({}, res, o)); }, {});
    });
};
var SelectableObject2 = function (data) { return null; };
var SelectableObject3 = function (data, result) { return null; };
var SelectableObject = function (object, type, result) {
    return {
        object: object,
        // type: type,
        result: result, y: y,
        select: function () {
            var entities = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                entities[_i] = arguments[_i];
            }
            var newResult = {};
            entities.forEach(function (key) { newResult[key] = object[key]; });
            return SelectableObject(newResult, entities.map(function (entity) { return entity; }), entities.map(function (entity) { return object[entity]; }));
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
var selected = selectableStudent.select('Name').select('Surname');
console.log(selected);
console.log(getKeys(student));
