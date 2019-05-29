"use strict";
let Func = (f) => ({
    func: f,
    call: function (x) {
        return this.func(x);
    },
    then: function (g) {
        return Func((x) => g.call(this.call(x)));
    }
});
let None = () => ({ kind: "None" });
let Some = (value) => ({
    kind: "Some",
    value: value
});
let Empty = () => ({ kind: "Empty" });
let Cons = (head, tail) => ({
    kind: "Cons",
    head: head,
    tail: tail
});
let OptionFunctor = (option) => ({
    ...option,
    map: (f) => Func((opt) => {
        if (opt.kind == "None") {
            return None();
        }
        else {
            return Some(f.call(opt.value));
        }
    })
});
