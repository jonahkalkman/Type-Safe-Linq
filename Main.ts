interface Student {
    Name: string,
    Surname: string,
    Grades:Array<Grades>,
    Test:Array<Test>,
    StudentNumber:number
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

// Rename into something like onlyArrays
type SubType<T> = Pick<T, {
    [K in keyof T]: T[K] extends Array<object> ? K : never
}[keyof T]>;

// werkt binnen include/orderby => buiten de orderby gaat het fout
type ArrayObject<T, K extends keyof T> =
    K extends Array<object> ? never : Pick<T, K>

type excludeArray<T> = Pick<T, {
    [K in keyof T]: T[K] extends Array<object> ? never : K
}[keyof T]>;

// Rename into something like PickKeysOfArray
type KeysArray<T, K extends keyof SubType<T>> = T[K] extends Array<infer U> ? U : never;

type Unit = {}

let Unit : Unit = {}

// used to make sure that the first argument is a select
type SelectableObject<T, B> = {
    object: Array<T>,
    select: <K extends keyof T>(...entities: Array<K>) => QueryableObject<omit<T, K>, Pick<T, K>, excludeArray<Pick<T,K>>>
}

type QueryableObject<T, R, B> = {
    object: Array<T>,
    result: Array<R>,
    select: <K extends keyof T>(...entities: Array<K>) => QueryableObject<omit<T, K> , R & Pick<T, K>, B & excludeArray<Pick<T,K>>>,
    include: <K extends keyof SubType<T>, s, r, b>(
        entity: K,
        query: (selectable: SelectableObject<KeysArray<T, K>, B>) => QueryableObject<s, r, b> | Result<r>
    ) => QueryableObject<omit<T, K>, R & { [key in K]: Array<r> }, B>,
    orderBy: <H extends keyof B>(type: 'ASC' | 'DESC', entity: H) => Result<R>
}

type Result<R> = {
    result: Array<R>
}

let Result = function<R>(result: Array<R>) : Result<R> {
    return {
        result: result
    }
}

let SelectableObject = function<T, B>(object: Array<T>) : SelectableObject<T, B> {
    return {
        object: object,
        select: function<K extends keyof T>(...entities: Array<K>) : QueryableObject<omit<T, K>, Pick<T, K>, excludeArray<Pick<T,K>>> {

            // Pick result
            let res = <any>([]);
            for(let i = 0; i < object.length; i++){
                // If multiple items inside Grades or Test
                if(Array.isArray(object[i]) && Object.keys(object[i]).length > 1){
                    let subArray: any = object[i] as any
                    res[i] = []
                    for(let g = 0; g < subArray.length; g++){
                        res[i].push(pick<T,K>(entities).f(subArray[g]))
                    }
                }
                else {
                    res[i] = pick<T,K>(entities).f(object[i])
                }
            }

            // Omit object
            const newObject = <any>([])
            object.forEach(element => {
                newObject.push(omit<T, K>(entities).f(element));
            });

            return QueryableObject<omit<T, K>, Pick<T, K>, excludeArray<Pick<T,K>>>(newObject, res);
        }
    }
}


let QueryableObject = function<T, R, B>(object: Array<T>, result: Array<R>) : QueryableObject<T, R, B> {
    return {
        object: object,
        result: result,
        select: function<K extends keyof T>(...entities: Array<K>) : QueryableObject<omit<T, K>, R & Pick<T, K>, B & excludeArray<Pick<T,K>>> {

            console.log('entities', entities)
            let res = <any>([]);
            for(let i = 0; i < object.length; i++){
                // If multiple items inside Grades or Test
                res[i] = {
                    ...(<any>result)[i],
                    ...pick<T,K>(entities).f(object[i])
                }
                // alleen werkt voor include
                if((<any>object)[i][0]) {
                    // Voor elk item binnen object, dus student 1 grades, student 2 grades etc
                    res[i] = []
                    for(let g = 0; g < Object.keys((<any>object)[i]).length; g++) {
                        // En dan voor alle entities die we meegeven
                        res[i][g] = {
                            ...(<any>result)[i][g],
                            ...pick<T,K>(entities).f((<any>object)[i][g])
                        };
                    }
                }
            }

            // Create a new object
            const newObject = <any>([])
            object.forEach(element => {
                newObject.push(omit<T, K>(entities).f(element));
            });

            // Merge result
            return QueryableObject<omit<T, K>, R & Pick<T, K>, B & excludeArray<T>>(newObject, res);
        },
        include: function<K extends keyof SubType<T>, s, r, b>(
            entity: K,
            query: (selectable: SelectableObject<KeysArray<T, K>, B>) => QueryableObject<s, r, b> | Result<r>
        ) : QueryableObject<omit<T, K>, R & { [key in K]: Array<r> }, B> {

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
                allKeysFromEntity.push((<any>element)[entity]);
            })

            // Create SelectableObject for query with allKeysFromEntity as object: T
            const selectableEntity: SelectableObject<KeysArray<T, K>, B> = SelectableObject(allKeysFromEntity);

            // Get result from query with selectableEntity
            const selectedEntities = query(selectableEntity).result;
            // Compose result into array
            const composedResult: r[] = selectedEntities;

            let res = <any>([]);
            for(let i = 0; i < object.length; i++){
                res[i] = {
                    ...(<any>result)[i],
                    ...{ [entity]:(<any>selectedEntities)[i] } as {[key in K]: Array<r> }
                }
            }

            return QueryableObject<omit<T, K>, R & { [key in K]: Array<r> }, B>(newObject, res);
        },
        orderBy: function<H extends keyof B>(type: 'ASC' | 'DESC', entity: H): Result<R> {

            const resres = result as any
            let orderedResult: Array<R> = result;
            if(resres[0][entity]){
                // console.log('result',result)
                orderedResult = (<any>result).sort(dynamicSort(entity));
            }
            else {
                for (let index = 0; index < resres.length; index++) {
                    const element = resres[index];
                    (<any>element).sort(dynamicSort(entity))
                }
            }

            function dynamicSort(property: any) {
                var sortOrder = type === 'ASC' ? 1 : -1;
                return function (a: any ,b: any) {
                    // Check if property is a string
                    if(a[property] === String) {
                        const uppercaseFirst = a[property].charAt(0).toUpperCase() + a[property].slice(1);
                        const uppercaseSecond = b[property].charAt(0).toUpperCase() + b[property].slice(1);

                        var res = (uppercaseFirst < uppercaseSecond) ? -1 : (uppercaseFirst > uppercaseSecond) ? 1 : 0;
                        return res * sortOrder;
                    }
                    else {
                        var res = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                        return res * sortOrder;
                    }
                }
            }
            return Result(orderedResult)
        }
    }
}

let student: Student = ({
    Name: 'Jonah',
    StudentNumber: 9,
    Surname: 'Kalkman',
    Grades: [{
        Grade: 3,
        CourseId: 5
    },
    {
        Grade: 1,
        CourseId: 2
    }
    ],
    Test:[{
        test1: 'c1',
        test2: 'a2'
    },
    {
        test1: 'c2',
        test2: 'b1'
    }
    ]
});

let student2: Student = ({
    Name: 'Robin',
    StudentNumber: 1.2,
    Surname: 'Breedveld',
    Grades: [{
        Grade: 3,
        CourseId: 6,
    },
    {
        Grade: 4,
        CourseId: 4,
    }],
    Test:[{
        test1: 't1',
        test2: 'c2'
    },
    {
        test1: 'd1',
        test2: 'd2'
    }]
});

let student3: Student = ({
    Name: 'Ali',
    StudentNumber: 6.7,
    Surname: 'Musharuf',
    Grades: [{
        Grade: 7,
        CourseId: 4,
    },
    {
        Grade: 2,
        CourseId: 1,
    }],
    Test:[{
        test1: 'z1',
        test2: 'e2'
    },
    {
        test1: 'f1',
        test2: 'f2'
    }]
});

let student4: Student = ({
    Name: 'Jonnah',
    StudentNumber: 8.9,
    Surname: 'Kalkman',
    Grades: [{
        Grade: 5.5,
        CourseId: 9,
    },
    {
        Grade: 2,
        CourseId: 9,
    }],
    Test:[{
        test1: 'z1',
        test2: 'z2'
    },
    {
        test1: 'a1',
        test2: 'a2'
    }]
});

let students =[student, student2, student3, student4]
let selectableStudent = SelectableObject<Student, Student>(students);
let selection = JSON.stringify(selectableStudent.select('Name').select('Surname', 'StudentNumber').select('Test').include('Grades', g => g.select('Grade').orderBy('DESC', 'Grade')).orderBy('ASC', 'Name').result, null, 4)
console.log('selection', selection);
