interface Student {
    Name: string,
    Surname: string,
    Grades:Array<{
        Grade: number;
        CourseId: number;
    }>,
    Test:Array<{
        test1: string,
        test2: string
    }>
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

type PickArray<T> = { [K in keyof T]: T[K] extends Array<object> ? K : never }[keyof T];
type KeysArray<T> = T extends Array<infer U> ? U : never;
type Unit = {}

type SelectableObject<T, R> = {
    object: T,
    result?: R,
    select: <K extends keyof T>(...entities: Array<K>) => SelectableObject<Omit<T, K> , R & Pick<T, K>>,
    include: <K extends PickArray<T>, P extends keyof KeysArray<T[K]>>(
        entity: K,
        query: (selectable: SelectableObject<KeysArray<T[K]>, Unit>) => SelectableObject<Omit<KeysArray<T[K]>, P>, Pick<KeysArray<T[K]>, P>>
    ) => SelectableObject<Omit<T, K>, R & Pick<KeysArray<T[K]>, P>>
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
        include: function<K extends PickArray<T>, P extends keyof KeysArray<T[K]>>(
            entity: K,
            query: (selectable: SelectableObject<KeysArray<T[K]>, Unit>) => SelectableObject<Omit<KeysArray<T[K]>, P>, Pick<KeysArray<T[K]>, P>>
        ) : SelectableObject<Omit<T, K>, R & Pick<KeysArray<T[K]>, P>> {

            // Push entity: K into an Array: Array<K>
            const entityArray: Array<K> = [];
            entityArray.push(entity);

            // Create a new object without entity: K
            const newObject: Omit<T, K> = omit<T, K>(entityArray).f(object);

            // Get childs from entity: K & move into array
            const allKeysFromEntity = (<any>object)[entity][0];

            // Create selectableObject for query with allKeysFromEntity as object: T
            const selectableEntity: SelectableObject<KeysArray<T[K]>, Unit> = SelectableObject(allKeysFromEntity);

            // Get result from query with selectableEntity
            const newResult = query(selectableEntity).result;

            // Merge old with new result
            const mergedResult: R & Pick<KeysArray<T[K]>, P> = Object.assign({}, result, newResult);

            return SelectableObject<Omit<T, K>, R & Pick<KeysArray<T[K]>, P>>(newObject, mergedResult);
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
        test1: 'test1value',
        test2: 'test2value'
    }]
});

let selectableStudent = SelectableObject(student);
let selection = selectableStudent.select('Name').include('Grades', q => q.select('CourseId')).result;
console.log('selection', selection);
