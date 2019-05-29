interface Student {
    Name:string,
    Surname:string,
    Grades:[{
        Grade:number,
        CourseId:number
    }]
}

type Fun<a,b> = {
    f : (_:a) => b
    then : <c>(g:Fun<b,c>) => Fun<a,c>
}

let fun = <a,b>(f : (_:a) => b) : Fun<a,b> =>
({
    f : f,
    then : function<c>(this:Fun<a,b>, g:Fun<b,c>) : Fun<a,c> {
        return then(this, g)
    }
})

let then = <a,b,c>(f:Fun<a,b>, g:Fun<b,c>) : Fun<a,c> =>
  fun<a,c>(a => g.f(f.f(a)))

const pick = <T, k extends keyof T>(keys: Array<k>): Fun<T, Pick<T, k>> =>
    fun(object =>
        keys.map(k => k in object ? { [k]: object[k] } : {})
        .reduce((res, o) => ({ ...res, ...o }), {}) as Pick<T, k>
    )

let getKeys = <T>(object: T): Array<keyof T> => Object.keys(object) as Array<keyof T>

type Omit<T, Conditions extends keyof T> = Pick<T, {
    [K in keyof T]: K extends Conditions ? never : K
}[keyof T]>

const omit = <T, k extends keyof T>(keys: Array<k>): Fun<T, Omit<T, k>> =>
    fun(object =>
        getKeys(object).map(k => (keys as Array<keyof T>).includes(k) ? {} : { [k]: object[k] })
        .reduce((res, o) => ({ ...res, ...o }), {}) as Omit<T, k>
    )

type SelectableObject<T, R> = {
    object: T,
    // type?: K[],
    result?: R,
    select: <K extends keyof T>(...entities: K[]) => SelectableObject<Omit<T, K>, R & Pick<T, K>>
}

let SelectableObject2 = <a>(data: a): SelectableObject<a, {}> => null!
let SelectableObject3 = <a, b>(data:a, result:b): SelectableObject<a, b> => null!

let SelectableObject = function<T, K extends keyof T>(object: T, type?: K[], result?: T[K][]) : SelectableObject<T,K> {
    return {
        object: object,
        // type: type,
        result: result,
        select: function<K extends keyof T>(...entities: K[]) : SelectableObject<Omit<T, K>, R & Pick<T, K>> {
            const newResult: any = {};
            entities.forEach(key => { newResult[key] = object[key] })
            return SelectableObject(newResult, entities.map(entity => entity), entities.map(entity => object[entity]));
        }
    }
}


// Create student en selectable
let student: Student = ({
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
console.log(getKeys(student))