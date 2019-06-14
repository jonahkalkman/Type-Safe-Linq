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
});

const then = <a,b,c>(f:Fun<a,b>, g:Fun<b,c>) : Fun<a,c> => fun<a,c>(a => g.f(f.f(a)))

const pick = <T, K extends keyof T>(keys: Array<K>): Fun<T, Pick<T, K>> => (
    fun(object =>
        keys.map(key => key in object ? { [key]: object[key] } : {})
        .reduce((res, o) => ({ ...res, ...o }), {}) as Pick<T, K>
    )
);

const getKeys = <T>(object: T): Array<keyof T> => Object.keys(object) as Array<keyof T>

type omit<T, Conditions extends keyof T> = Pick<T, {
    [K in keyof T]: K extends Conditions ? never : K
}[keyof T]>

const omit = <T, K extends keyof T>(keys: Array<keyof T>): Fun<T, omit<T, K>> => (
    fun(object =>
        getKeys(object).map(key => (keys as Array<keyof T>).includes(key) ? {} : { [key]: object[key] })
        .reduce((res, o) => ({ ...res, ...o }), {}) as omit<T, K>
    )
);

type SubType<T> = Pick<T, {
    [K in keyof T]: T[K] extends Array<object> ? K : never
}[keyof T]>;

type KeysArray<T, K extends keyof SubType<T>> = T[K] extends Array<infer U> ? U : never;
type Unit = {}
let Unit : Unit = {}
type QueryableObject<T, R> = {
    object: T,
    result: R,
    select: <K extends keyof T>(...entities: Array<K>) => QueryableObject<omit<T, K> , R & Pick<T, K>>,
    include: <K extends keyof SubType<T>, s, r>(
        entity: K,
        query: (selectable: QueryableObject<KeysArray<T, K>, Unit>) => QueryableObject<s, r>
    ) => QueryableObject<omit<T, K>, R & { [key in K]: Array<r> }>
}

type SelectableObject<T> = {
    object: T,
    select: <K extends keyof T>(...entities: Array<K>) => QueryableObject<omit<T, K> , Pick<T, K>>
}

let SelectableObject = function<T, R>(object: T, result?: R) : SelectableObject<T> {
    return {
        object: object,
        select: function<K extends keyof T>(...entities: Array<K>) : QueryableObject<omit<T, K>, R & Pick<T, K>> {
            // Pick result
            const newResult: Pick<T, K> = pick<T,K>(entities).f(object)
            // omit object
            const newObject: omit<T, K> = omit<T, K>(entities).f(object);
            // Merge result
            const mergedResult: R & Pick<T, K> = Object.assign({}, result, newResult);

            return QueryableObject<omit<T, K>, R & Pick<T, K>>(newObject, mergedResult);
        }
    }
}

let QueryableObject = function<T, R>(object: T, result: R) : QueryableObject<T, R> {
    return {
        object: object,
        result: result,
        select: function<K extends keyof T>(...entities: Array<K>) : QueryableObject<omit<T, K>, R & Pick<T, K>> {
            // Pick result
            const newResult: Pick<T, K> = pick<T,K>(entities).f(object)
            // omit object
            const newObject: omit<T, K> = omit<T, K>(entities).f(object);
            // Merge result
            const mergedResult: R & Pick<T, K> = Object.assign({}, result, newResult);

            return QueryableObject<omit<T, K>, R & Pick<T, K>>(newObject, mergedResult);
        },
        include: function<K extends keyof SubType<T>, s, r>(
            entity: K,
            query: (selectable: QueryableObject<KeysArray<T,K>, Unit>) => QueryableObject<s, r>
        ) : QueryableObject<omit<T, K>, R & { [key in K]: Array<r> }> {

            // Push entity: K into an Array: Array<K>
            const entityArray: Array<K> = [];
            entityArray.push(entity);

            // Create a new object without entity: K
            const newObject: omit<T, K> = omit<T, K>(entityArray).f(object);

            // Get childs from entity: K & move into array
            const allKeysFromEntity = (<any>object)[entity][0];

            // Create QueryableObject for query with allKeysFromEntity as object: T
            const selectableEntity: QueryableObject<KeysArray<T, K>, Unit> = QueryableObject(allKeysFromEntity, Unit);

            // Get result from query with selectableEntity
            const selectedEntities : Pick<KeysArray<T, K>, P> = query(selectableEntity).result;

            // // Compose result into array
            // const composedResult : Pick<KeysArray<T, K>, P>[] = [selectedEntities];

            const newResult = { [entity]: selectedEntities }

            // console.log(ob[entity])
            // const test = { [entity]: [
            //     selectedEntities
            // ]};

            // console.log('test', test);


            //SPREAD OPERATORS?
            // Merge old with new result
            const mergedResult: R & { [key in K]: Array<r> } = Object.assign({}, result, newResult);

            return QueryableObject<omit<T, K>, R & { [key in K]: Array<r> }>(newObject, mergedResult);
        }
    }
}

let student: Student = ({
    Name: 'Jonah',
    Surname: 'Kalkman',
    Grades: [{
        Grade: 10,
        CourseId: 20
    }],
    Test:[{
        test1: 'test1value',
        test2: 'test2value'
    }]
});

let student2: Student = ({
    Name: 'Jonah',
    Surname: 'Kalkman',
    Grades: [{
        Grade: 10,
        CourseId: 10,
    }],
    Test:[{
        test1: 'test1value',
        test2: 'test2value'
    }]
});

// Fix double include

let selectableStudent = SelectableObject(student);
let selection = selectableStudent.select('Grades').include('Test', q => q.select('test1')).result;

if (selection != undefined)
    selection.Test[0].test1
    console.log('selection', selection);
// selection.
    // selection.Grades[0].CourseId //ok
    // selection.Grades[0].Grade //ok
