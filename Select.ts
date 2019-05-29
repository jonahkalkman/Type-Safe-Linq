interface Student {
    Name: string,
    Surname: string,
    Grades:[{
        Grade: number,
        CourseId: number
    }],
    Test:[{
        test1: string,
        test2: string
    }]
}

type Fun<a,b> = {
    f : (_:a) => b
    then : <c>(g:Fun<b,c>) => Fun<a,c>
}

let fun = <a,b>(f : (_:a) => b) : Fun<a,b> => ({
    f : f,
    then : function<c>(this:Fun<a,b>, g:Fun<b,c>) : Fun<a,c> {
        return then(this, g)
    }
})

const then = <a,b,c>(f:Fun<a,b>, g:Fun<b,c>) : Fun<a,c> => fun<a,c>(a => g.f(f.f(a)))

const pick = <T, K extends keyof T>(keys: Array<K>): Fun<T, Pick<T, K>> =>
    fun(object =>
        keys.map(key => key in object ? { [key]: object[key] } : {})
        .reduce((res, o) => ({ ...res, ...o }), {}) as Pick<T, K>
    )

const getKeys = <T>(object: T): Array<keyof T> => Object.keys(object) as Array<keyof T>

type Omit<T, Conditions extends keyof T> = Pick<T, {
    [K in keyof T]: K extends Conditions ? never : K
}[keyof T]>

const omit = <T, K extends keyof T>(keys: Array<keyof T>): Fun<T, Omit<T, K>> =>
    fun(object =>
        getKeys(object).map(key => (keys as Array<keyof T>).includes(key) ? {} : { [key]: object[key] })
        .reduce((res, o) => ({ ...res, ...o }), {}) as Omit<T, K>
    )

type ExcludeNonArray<T> = { [K in keyof T]: T[K] extends Array<object> ? K : never }[keyof T];

type SelectableObject<T, R> = {
    object: T,
    result?: R,
    select: <K extends keyof T>(...entities: Array<K>) => SelectableObject<Omit<T, K>, R & Pick<T, K>>,
    include: <K extends ExcludeNonArray<T>>(entity: K, query: Fun<SelectableObject<K , R & Pick<T, K>>, SelectableObject<Omit<T, K>, R & Pick<T, K>>>) => SelectableObject<Omit<T, K>, R & Pick<T, K>>
}

let SelectableObject = function<T, R>(object: T, result?: R) : SelectableObject<T, R> {
    return {
        object: object,
        result: result,
        select: function<K extends keyof T>(...entities: Array<K>) : SelectableObject<Omit<T, K>, R & Pick<T, K>> {
            // Pick result
            const newResult: Pick<T, K> = pick<T,K>(entities).f(object)
            // Omit object
            const newObject: Omit<T, K> = omit<T, K>(entities).f(object);
            // Merge result
            const mergedResult: R & Pick<T, K> = Object.assign({}, result, newResult);

            return SelectableObject<Omit<T, K>, R & Pick<T, K>>(newObject, mergedResult);
        },
        include: function<K extends ExcludeNonArray<T>>(entity: K, query: Fun<SelectableObject<K, R & Pick<T, K>>, SelectableObject<Omit<T, K>, R & Pick<T, K>>>)  : SelectableObject<Omit<T, K>, R & Pick<T, K>>{
            return null!;
        }
    }
}

let student: Student = ({
    Name: 'Jonah',
    Surname: 'Kalkman',
    Grades: [{
        Grade: 10,
        CourseId: 1
    }],
    Test:[{
        test1: 'test1',
        test2: 'test2'
    }]
});

let selectableStudent = SelectableObject(student);
let selection = selectableStudent.select('Name');
console.log(selection);
