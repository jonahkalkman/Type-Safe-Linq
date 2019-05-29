"use strict";
let Person = (name, lastName, age, gender) => ({
    name: name,
    lastName: lastName,
    age: age,
    gender: gender
});
let SelectablePerson = (person) => ({
    ...person,
    select: function (property) {
        return this[property];
    }
});
let p = Person("John", "Doe", 34, "M");
let sp = SelectablePerson(p);
let age = sp.select("age");
console.log(age);
