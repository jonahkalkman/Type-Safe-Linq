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
var Person = function (name, lastName, age, gender) { return ({
    name: name,
    lastName: lastName,
    age: age,
    gender: gender
}); };
var SelectablePerson = function (person) { return (__assign({}, person, { select: function (property) {
        return this[property];
    } })); };
var p = Person("John", "Doe", 34, "M");
var sp = SelectablePerson(p);
var age = sp.select("age");
console.log(age);
