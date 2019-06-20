interface Student {
    Name: string,
    Surname: string,
    Grades:Array<Grades>,
    Test:Array<Test>
}

interface Grades {
    Grade: number;
    CourseId: number;
}

interface Test {
    test1: string,
    test2: string
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
    object: Array<T>,
    result: R,
    select: <K extends keyof T>(...entities: Array<K>) => QueryableObject<omit<T, K> , R & [Pick<T, K>]>,
    include: <K extends keyof SubType<T>, s, r>(
        entity: K,
        query: (selectable: SelectableObject<KeysArray<T, K>>) => QueryableObject<s, r>
    ) => QueryableObject<omit<T, K>, R & Array<{ [key in K]: Array<r> }>>
}

type SelectableObject<T> = {
    object: Array<T>,
    select: <K extends keyof T>(...entities: Array<K>) => QueryableObject<omit<T, K> , [Pick<T, K>]>
}

let SelectableObject = function<T, R>(object: Array<T>) : SelectableObject<T> {
    return {
        object: object,
        select: function<K extends keyof T>(...entities: Array<K>) : QueryableObject<omit<T, K>, [Pick<T, K>]> {

            // Pick result
            let res = <any>([]);
            for(let i = 0; i < object.length; i++){
                res[i] = pick<T,K>(entities).f(object[i])
            }

            // Omit object
            const newObject = <any>([])
            object.forEach(element => {
                newObject.push(omit<T, K>(entities).f(element));
            });

            return QueryableObject<omit<T, K>, [Pick<T, K>]>(newObject, res);
        }
    }
}

let QueryableObject = function<T, R>(object: Array<T>, result: R) : QueryableObject<T, R> {
    return {
        object: object,
        result: result,
        select: function<K extends keyof T>(...entities: Array<K>) : QueryableObject<omit<T, K>, R & [Pick<T, K>]> {

            // Pick result
            let newResult = <any>([])
                object.forEach(element => {
                newResult.push(pick<T,K>(entities).f(element));
            });

            let res = <any>([]);
            for(let i = 0; i < object.length; i++){
                res[i] = {
                    ...(<any>result)[i],
                    ...pick<T,K>(entities).f(object[i])
                }
            }

            // Create a new object
            const newObject = <any>([])
            object.forEach(element => {
                newObject.push(omit<T, K>(entities).f(element));
            });

            // Merge result
            return QueryableObject<omit<T, K>, R & [Pick<T, K>]>(newObject, res);
        },
        include: function<K extends keyof SubType<T>, s, r>(
            entity: K,
            query: (selectable: SelectableObject<KeysArray<T,K>>) => QueryableObject<s, r>
        ) : QueryableObject<omit<T, K>, R & Array<{ [key in K]: Array<r> }>> {

            // Push entity: K into an Array: Array<K>
            const entityArray: Array<K> = [];
            entityArray.push(entity);

            // Create a new object without entity: K
            const newObject = <any>([])
            object.forEach(element => {
                newObject.push(omit<T, K>(entityArray).f(element));
            });

            // Get childs from entity: K & move into array
            const allKeysFromEntity = <any>([])
            object.forEach(element => {
                allKeysFromEntity.push((<any>element)[entity][0]);
            })

            // Create QueryableObject for query with allKeysFromEntity as object: T
            const selectableEntity: SelectableObject<KeysArray<T, K>> = SelectableObject(allKeysFromEntity);

            // Get result from query with selectableEntity
            const selectedEntities = query(selectableEntity).result;
            console.log(selectedEntities)

            // Compose result into array
            const composedResult: r[] = [selectedEntities];

            let res = <any>([]);
            for(let i = 0; i < object.length; i++){
                console.log((<any>selectedEntities)[i])
                res[i] = {
                    ...(<any>result)[i],
                    ...{ [entity]: (<any>selectedEntities)[i] } as { [key in K]: Array<r> }
                }
            }

            return QueryableObject<omit<T, K>, R & Array<{ [key in K]: Array<r> }>>(newObject, res);
        }
    }
}

let student: Student = ({
    Name: 'Jonah',
    Surname: 'Kalkman',
    Grades: [{
        Grade: 10,
        CourseId: 20
    },
    {
        Grade: 4,
        CourseId: 2
    }],
    Test:[{
        test1: 'test1value',
        test2: 'test2value'
    }]
});

let student2: Student = ({
    Name: 'Henk',
    Surname: 'Kalkmwwwan',
    Grades: [{
        Grade: 10,
        CourseId: 10,
    }],
    Test:[{
        test1: 'test122value',
        test2: 'test222value'
    }]
});

let students =[student, student2]
let selectableStudent = SelectableObject(students);
let selection = selectableStudent.select('Name').select('Surname').include('Grades', q => q.select('CourseId', 'Grade'))
console.log("result", selection.result[1].Grades)

// console.log('selectie', (<any>selection[0].Name))
// if (selection != undefined)
//     selection.Test[0].test1
//     console.log('selection', selection);
// selection.
    // selection.Grades[0].CourseId //ok
    // selection.Grades[0].Grade //ok
