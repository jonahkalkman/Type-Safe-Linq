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

type Omit<T, Conditions extends keyof T> = Pick<T, {
    [K in keyof T]: K extends Conditions ? never : K
}[keyof T]>

const omit = <T, K extends keyof T>(keys: Array<keyof T>): Fun<T, Omit<T, K>> => (
    fun(object =>
        getKeys(object).map(key => (keys as Array<keyof T>).includes(key) ? {} : { [key]: object[key] })
        .reduce((res, o) => ({ ...res, ...o }), {}) as Omit<T, K>
    )
);

type SubType<T> = Pick<T, {
    [K in keyof T]: T[K] extends Array<object> ? K : never
}[keyof T]>;

type KeysArray<T, K extends keyof SubType<T>> = T[K] extends Array<infer U> ? U : never;
type Unit = {}

type QueryableObject<T, R> = {
    object: Array<T>,
    result?: R,
    select: <K extends keyof T>(...entities: Array<K>) => QueryableObject<Omit<T, K> , R & Pick<T, K>[]>,
    include: <K extends keyof SubType<T>, P extends keyof KeysArray<T, K>>(
        entity: K,
        query: (selectable: QueryableObject<KeysArray<T,K>, Unit>) => QueryableObject<Omit<KeysArray<T, K>, P>, Pick<KeysArray<T, K>, P>>
    ) => QueryableObject<Omit<T, K>, R & { [x: string]: Pick<KeysArray<T, K>, P> | Object }>
}

type SelectableObject<T> = {
    object: Array<T>,
    select: <K extends keyof T>(...entities: Array<K>) => QueryableObject<Omit<T, K> , Pick<T, K>[]>
}

let SelectableObject = function<T, R>(object: Array<T>, result?: R) : SelectableObject<T> {
    return {
        object: object,
        select: function<K extends keyof T>(...entities: Array<K>) : QueryableObject<Omit<T, K>, R & Pick<T, K>[]> {
            let newResult: Array<Pick<T,K>> = [];
            let newObject: Array<Omit<T, K>> = []
            // Pick result
            object.forEach(element => {
                newResult.push(pick<T,K>(entities).f(element));
                newObject.push(omit<T, K>(entities).f(element));
            });

            // TODO: Merge results together, now oldresult is lost
            const mergedResult: R & Array<Pick<T, K>> = Object.assign({}, result, newResult);

            return QueryableObject<Omit<T, K>, R & Pick<T, K>[]>(newObject, mergedResult);
        }
    }
}

let QueryableObject = function<T, R>(object: Array<T>, result?: R) : QueryableObject<T, R> {
    return {
        object: object,
        result: result,
        select: function<K extends keyof T>(...entities: Array<K>) : QueryableObject<Omit<T, K>, R & Pick<T, K>[]> {
            let newResult: Array<Pick<T,K>> = [];
            let newObject: Array<Omit<T, K>> = []
            // Pick result
            object.forEach(element => {
                newResult.push(pick<T,K>(entities).f(element));
                newObject.push(omit<T, K>(entities).f(element));
            });

            // TODO: Merge results together, now oldresult is lost
            const mergedResult: R & Array<Pick<T, K>> = Object.assign({}, result, newResult);

            return QueryableObject<Omit<T, K>, R & Pick<T, K>[]>(newObject, mergedResult);
        },
        include: function<K extends keyof SubType<T>, P extends keyof KeysArray<T, K>>(
            entity: K,
            query: (selectable: QueryableObject<KeysArray<T,K>, Unit>) => QueryableObject<Omit<KeysArray<T, K>, P>, Pick<KeysArray<T, K>, P>>
        ) : QueryableObject<Omit<T, K>, R & { [x: string]: Pick<KeysArray<T, K>, P> | Object }> {

            // Push entity: K into an Array: Array<K>
            const entityArray: Array<K> = [];
            entityArray.push(entity);

            // Create a new object without entity: K
            const newObject: Omit<T, K> = omit<T, K>(entityArray).f(object);

            // Get childs from entity: K & move into array
            const allKeysFromEntity = (<any>object)[entity][0];

            // Create QueryableObject for query with allKeysFromEntity as object: T
            const selectableEntity: QueryableObject<KeysArray<T, K>, Unit> = QueryableObject(allKeysFromEntity);

            // Get result from query with selectableEntity
            const selectedEntities = query(selectableEntity).result;

            // Compose result into array
            const composedResult = [];
            composedResult.push(selectedEntities);

            const newResult = { [entity]: result ? composedResult : {} }

            // Merge old with new result
            const mergedResult: R & { [x: string]: Pick<KeysArray<T, K>, P> | Object} | undefined = Object.assign({}, result, newResult);

            return QueryableObject<Omit<T, K>, R & { [x: string]: Pick<KeysArray<T, K>, P> | Object }>(newObject, mergedResult);
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
let selection = selectableStudent.select('Grades').result;

// selection.
//     selection.Grades[0].CourseId //ok
//     selection.Grades[0].Grade //ok
console.log('selection', selection);
