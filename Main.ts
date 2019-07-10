//This the interface for the student
interface Student {
    Name: string,
    Surname: string,
    Grades:Array<Grades>,
    Test:Array<Test>,
    StudentNumber:number
}
// This is the interface for the Grades connected to the students
interface Grades {
    Grade: number;
    CourseId: number;
}

// This is an interface existing out of an array to test the code
interface Test {
    test1: string,
    test2: string
}

// Type Fun and let fun are used to build the pick
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

// Pick pakt van T alles in K ; example: Pick<Student, Name> => Dit pakt de naam van de geselecteerde student
const pick = <T, K extends keyof T>(keys: Array<K>): Fun<T, Pick<T, K>> => (
    fun(object =>
        keys.map(key => key in object ? { [key]: object[key] } : {})
        .reduce((res, o) => ({ ...res, ...o }), {}) as Pick<T, K>
    )
);

// Pakt van een object T, alle bestaande keys; example => pakt alle keys van student => name, surname, studennummer
const getKeys = <T>(object: T): Array<keyof T> => Object.keys(object) as Array<keyof T>


/* Omit:
Het Omit<T, K> type zit niet standaard in typescript.
Dit type wordt gebruikt om bepaalde keys van een object te verwijderen.
Het returnt het object minus de keys doorgegeven in k.
> T: Het object waar je de keys van wilt verwijderen.
> K extends keyof T: De keys die je wilt verwijderen.
*/

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
// Pakt alle keys die een array zijn van object T; example: Wordt als input gebruikt bij de include
type SubType<T> = Pick<T, {
    [K in keyof T]: T[K] extends Array<object> ? K : never
}[keyof T]>;

// Pakt alle keys van object T die geen array zijn
type excludeArray<T> = Pick<T, {
    [K in keyof T]: T[K] extends Array<object> ? never : K
}[keyof T]>;

// Rename into something like PickKeysOfArray
// Pakt alle keys van de array; dit zorgt ervoor dat je makkelijk bij de keys van een array kan komen
type KeysArray<T, K extends keyof SubType<T>> = T[K] extends Array<infer U> ? U : never;

type Unit = {}

let Unit : Unit = {}

// Wordt gebruikt voor de allereerste select en de select in de include
type SelectableObject<T, B> = {
    object: Array<T>,
    select: <K extends keyof T>(...entities: Array<K>) => QueryableObject<omit<T, K>, Pick<T, K>, excludeArray<Pick<T,K>>>
}

// Bevat alle operations na de allereerste select en na de allereeste select in include
type QueryableObject<T, R, B> = {
    object: Array<T>,
    result: Array<R>,
    /* Select:
    Krijgt als input een array van keys van object T; Array<K> zijn de keys, en K extends T
    select returns een QueryableObject ; met een object T waarvan er al keys vanaf gehaald zijn +
    het oude result samengevoegd met de keys die je meegeeft als input parameters +
    B = het hele object samengevoegd met alle input parameters die geen Arrays zijn ( voor de orderby )
    binnen select zijn K altijd de entities
    */
    select: <K extends keyof T>(...entities: Array<K>) => QueryableObject<omit<T, K> , R & Pick<T, K>, B & excludeArray<Pick<T,K>>>,

    /* Include:
    Krijgt als input 1 entity en die moet een array zijn. dat doen wij door middel van subtype T +
    Query: ontvangt een selectable, selectable is een selectable object van de entities die je meegeeft / Hij pakt de childs van de input entity
    + returns een queryable object zodat alle iperations weer mogelijk zijn. 'S R B' worden automatisch geinfered = afleiden van => hij kiest zelf wat hij wilt zijn.
    Of je geeft een Result van R, dit zorgt ervoor dat alleen de result operation mogelijk is.
    S = het object
    R = oude + nieuwe resultaat
    B = (verkleinde) student, hier zit dus alleen bijvoorbeeld Grade en CourseId in

    Include returns een queryable object met Omit<T,K> ; een object T waarvan er al keys eraf gehaald zijn +
    Result:
        [key in K) = allen de key Grades, niet de waardes van Grades
            - : Array<r> = Zet de keys in Grades + oude result
    B = weer het hele object wat klaargemaakt is voor de orderby, deze bevat geen arrays, B is dus niet aangepast in de include
    */
    include: <K extends keyof SubType<T>, s, r, b>(
        entity: K,
        query: (selectable: SelectableObject<KeysArray<T, K>, B>) => QueryableObject<s, r, b> | Result<r>
    ) => QueryableObject<omit<T, K>, R & { [key in K]: Array<r> }, B>,

    /*
    B = student
    H zijn de keys van T die je geselecteerd hebt en die geen Array zijn
    Je geeft een type ASC of DESC mee
    entity is de input parameter waarop je wilt orderen
    Result<R> => je returned je resultaat => hierna is het alleen mogelijk om nog een .Result te doen
    */
    orderBy: <H extends keyof B>(type: 'ASC' | 'DESC', entity: H) => Result<R>
}

// Wordt alleen gebruikt bij orderby, zodat je geen operaties meer kan doen. Wordt opgeslagen in let Result
type Result<R> = {
    result: Array<R>
}

// Result wordt hierin opgeslagen na de orderby
let Result = function<R>(result: Array<R>) : Result<R> {
    return {
        result: result
    }
}

// Je hebt hierbij geen resultaat, omdat je nog geen result hebt
let SelectableObject = function<T, B>(object: Array<T>) : SelectableObject<T, B> {
    return {
        object: object,
        // zie uitleg bij de type van selectable object
        select: function<K extends keyof T>(...entities: Array<K>) : QueryableObject<omit<T, K>, Pick<T, K>, excludeArray<Pick<T,K>>> {

            // Pick result
            let res = <any>([]);
            // Doorloop alle dingen in object T om de keys op te halen.
            for(let i = 0; i < object.length; i++){
                // If multiple items inside Grades or Test
                // Als de key een array is, aka Grades of Test
                if(Array.isArray(object[i]) && Object.keys(object[i]).length > 1){
                    // subarray is de key => Grades of Test - object[i] is Grades of Test
                    let subArray: any = object[i] as any
                    res[i] = []
                    // Dan doorloop je alle items in die array
                    // i = Grades of Test
                    // g = het object binnen Grades of Test
                    for(let g = 0; g < subArray.length; g++){
                        // voor iedere item binnen de array, voeg je ze toe aan de result, [g] = index van de keys van Grades of Test
                        res[i].push(pick<T,K>(entities).f(subArray[g]))
                    }
                }
                else {
                    // Als het geen array is voeg je de geselecteerd items toe aan result, [i] = voor de juiste index
                    res[i] = pick<T,K>(entities).f(object[i])
                }
            }

            // Omit object
            // Dit zorgt ervoor dat de al geselecteerde items niet opnieuw kan worden geselecteerd.
            // Voor iedere student maak je een nieuwe entity aan, foreach geld dus voor iedere student
            const newObject = <any>([])
            object.forEach(element => {
                newObject.push(omit<T, K>(entities).f(element));
            });

            // returned queryable object met nieuw object + new resultaat
            return QueryableObject<omit<T, K>, Pick<T, K>, excludeArray<Pick<T,K>>>(newObject, res);
        }
    }
}


let QueryableObject = function<T, R, B>(object: Array<T>, result: Array<R>) : QueryableObject<T, R, B> {
    return {
        object: object,
        result: result,
        // zie uitleg bij de type van queryable object
        select: function<K extends keyof T>(...entities: Array<K>) : QueryableObject<omit<T, K>, R & Pick<T, K>, B & excludeArray<Pick<T,K>>> {
            // voor alle studenten maken we een nieuwe resultaat
            let res = <any>([]);
            // forloop voor iedere student om ze allemaal te doorlopen
            for(let i = 0; i < object.length; i++){
                // res voor items die geen array zijn, old + new resultaat => dmv een spread
                res[i] = {
                    ...(<any>result)[i],
                    ...pick<T,K>(entities).f(object[i])
                }
                // werkt alleen voor include, omdat dit een array is
                if((<any>object)[i][0]) {
                    res[i] = []
                    // voor alle items binnen je array -> voeg je weer toe aan je resultaat + oude resultaat
                    for(let g = 0; g < Object.keys((<any>object)[i]).length; g++) {
                        // res voor items die geen array zijn, old + new resultaat => dmv een spread
                        res[i][g] = {
                            ...(<any>result)[i][g],
                            ...pick<T,K>(entities).f((<any>object)[i][g])
                        };
                    }
                }
            }

            // Omit object
            // Dit zorgt ervoor dat de al geselecteerde items niet opnieuw kan worden geselecteerd.
            // Voor iedere student maak je een nieuwe entity aan, foreach geld dus voor iedere student
            const newObject = <any>([])
            object.forEach(element => {
                newObject.push(omit<T, K>(entities).f(element));
            });

            // returned nieuwe object en het (oude resultaat + nieuwe resultaat) + oude B + nieuwe B
            return QueryableObject<omit<T, K>, R & Pick<T, K>, B & excludeArray<T>>(newObject, res);
        },
        // zelfde als type van include van queryable
        include: function<K extends keyof SubType<T>, s, r, b>(
            entity: K,
            query: (selectable: SelectableObject<KeysArray<T, K>, B>) => QueryableObject<s, r, b> | Result<r>
        ) : QueryableObject<omit<T, K>, R & { [key in K]: Array<r> }, B> {

            // Push entity: K into an Array: Array<K>, zodat je een omit kan uitvoeren
            const entityArray: Array<K> = [];
            entityArray.push(entity);

            // Create a new object without entity: K
            const newObject = <any>([])
            object.forEach(element => {
                newObject.push(omit<T, K>(entityArray).f(element));
            });

            // Get childs from entity: K & move into array, push alle entities die we doorkrijgen in een array, zodat je daarmee verder kan werken
            const allKeysFromEntity = <any>([])
            object.forEach(element => {
                allKeysFromEntity.push((<any>element)[entity]);
            })

            // Create SelectableObject for query with allKeysFromEntity as object: T, dan maak je van alle allKeysFromEntity een selectableobject
            const selectableEntity: SelectableObject<KeysArray<T, K>, B> = SelectableObject(allKeysFromEntity);

            // Get result from query with selectableEntity, pak je het resultaat van selectableobject, zodat je die in het nieuwe resultaat kan zetten
            const selectedEntities = query(selectableEntity).result;

            let res = <any>([]);
            // voor alle studenten maak je een nieuw resultaat
            for(let i = 0; i < object.length; i++){
                // oude res + nieuwe res dmv spread operator
                res[i] = {
                    ...(<any>result)[i],
                    ...{ [entity]:(<any>selectedEntities)[i] } as {[key in K]: Array<r> }
                }
            }
            // returned nieuwe object en het (oude resultaat + nieuwe resultaat) + oude B + nieuwe B
            return QueryableObject<omit<T, K>, R & { [key in K]: Array<r> }, B>(newObject, res);
        },
        // zie type van orderby
        orderBy: function<H extends keyof B>(type: 'ASC' | 'DESC', entity: H): Result<R> {
            // resres maak je een any zodat je het kan benaderen als array
            const resres = result as any
            let orderedResult: Array<R> = result;
            // dit checkt of de entity binnen je result een array is
            if(resres[0][entity]){
                // als het array is, dan mag je de entity gaan orderen
                orderedResult = (<any>result).sort(dynamicSort(entity));
            }
            else {
                // als het een nonarray is, ga je voor elke index in je result ga hem sorteren
                // resres[index] = 1,2,3 etc student
                // <any>element is bijv de naam van een student
                for (let index = 0; index < resres.length; index++) {
                    const element = resres[index];
                    (<any>element).sort(dynamicSort(entity))
                }
            }

            function dynamicSort(property: any) {
                // als het type ASC is dan maakt hij er een 1 van en anders zet hij hem 1 positie omlaag (-1)
                var sortOrder = type === 'ASC' ? 1 : -1;
                // a = 1e item binnen grades,
                // b = 2e item binnen grades,
                // die worden samen vergeleken en die krijgen dan een nieuwe a & b, netals mergesort kinda
                return function (a: any ,b: any) {
                    // Check if property is a string
                    if(a[property] === String) {
                        //  je pakt eerst de eerste letter, die maak je uppercase, daarna plak je derest van de string er weer achter
                        const uppercaseFirst = a[property].charAt(0).toUpperCase() + a[property].slice(1);
                        const uppercaseSecond = b[property].charAt(0).toUpperCase() + b[property].slice(1);
                        // zorgt ervoor dat de 2 items gesorteerd worden
                        var res = (uppercaseFirst < uppercaseSecond) ? -1 : (uppercaseFirst > uppercaseSecond) ? 1 : 0;
                        return res * sortOrder;
                    }
                    else {
                        // zogt ervoor dat de 2 niet strings gesorteerd worden
                        var res = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                        // bepalen of de volgorde wijzigd
                        // 1 * 1 = ASC
                        // -1 * 0 = DESC
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

let students = [student, student2, student3, student4]
let selectableStudent = SelectableObject<Student, Student>(students);
let selection = JSON.stringify(selectableStudent.select('Name', 'Grades').select('StudentNumber', 'Surname').include('Test', t => t.select('test2').orderBy('ASC', 'test2')).orderBy('ASC', 'Surname').result, null, 4)
console.log('selection', selection);
