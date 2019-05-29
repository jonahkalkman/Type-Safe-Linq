// interface Student {
//     Name:string,
//     Surname:string,
//     Grades:[{
//         Grade:number,
//         CourseId:number
//     }]
// }

// type Omit<T, Conditions extends keyof T> = Pick<T, {
//     [K in keyof T]: K extends Conditions ? never : K
// }[keyof T]>

// interface Fun<a,b> {
//     f : (_:a) => b
//     then : <c>(g:Fun<b,c>) => Fun<a,c>
// }

// let Fun = <a,b>(f : (_:a) => b) : Fun<a,b> => ({
//     f : f,
//     then : function<c>(this:Fun<a,b>, g:Fun<b,c>) : Fun<a,c> {
//         return then(this, g)
//     }
// })

// let then = <a,b,c>(f:Fun<a,b>, g:Fun<b,c>) : Fun<a,c> => Fun<a,c>(a => g.f(f.f(a)))
// let getKeys = <T>(object: T): Array<keyof T> => Object.keys(object) as Array<keyof T>

// // ToDo: Omit ombouwen voor objecten omit().f(object), Fun<T, Omit<T, k>> aanpassen om object als parameter door te geven, in plaats van expliciet
// let Omit = <T, k extends keyof T>(keys: Array<k>): Fun<T, Omit<T, k>> => (
//     Fun( object =>
//         getKeys(object).map(k => (keys as Array<keyof T>).includes(k) ? {} : { [k]: object[k] })
//         .reduce((res, o) => ({ ...res, ...o }), {}) as Omit<T, k>
//     )
// )

// type SelectableObject<T, R> = {
//     object: T,
//     result?: R,
//     select: <K extends keyof T>(...entities: K[]) => SelectableObject<Omit<T, K>, R & Pick<T, K>>
// }


// // Uitleg Omit = ['name'] = surname en grades over == nieuwe object
// // Uitleg Pick = ['name'] = name over == result

// let SelectableObject = function<T, R>(object: T, result?: R) : SelectableObject<T,R> {
//     return {
//         object: object,
//         result: result,
//         select: function<K extends keyof T>(...entities: K[]) : SelectableObject<Omit<T, K>, R & Pick<T, K>> {

//             // ToDo Omit
//             const keys: any = {};
//             entities.forEach(key => { keys[key] = object[key] })
//             const newObject = Omit(keys).f(object);

//             // ToDo oldresult + Pick voor newresult

//             return SelectableObject(newObject, )
//         }
//     }
// }

// // ToDo: create include = selectObject binnen je selectObject

// let student: Student = ({
//     Name: 'Jonah',
//     Surname: 'Kalkman',
//     Grades: [{
//         Grade: 10,
//         CourseId: 1
//     }]
// });
// let selectableStudent = SelectableObject(student);
// let selected = selectableStudent.select('Name');
// console.log(selected);
