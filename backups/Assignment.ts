// interface Student {
//   Name:string,
//   Surname:string
//   // Grades:[
//   //   {
//   //     Grade:number,
//   //     CourseId:number
//   //   }
//   // ]
// }

// let Student =
//   (
//     Name:string,
//     Surname:string
//     // Grades:[
//     //   {
//     //     Grade:number,
//     //     CourseId:number
//     //   }
//     // ]
//   ): Student => ({
//     Name:Name,
//     Surname:Surname
//     // Grades:Grades
//   })

// let selectableStudent = (student: Student) => ({
//   ...student,
//   select: function<K extends keyof Student>(this: Student, property: K): Student[K] {
//     return this[property]
//   }
// })

// type SelectableEntity<T> = T & {
//   select: <K extends keyof T>(this: T, property: K) => T[K]
// }

// type selectableStudent = SelectableEntity<Student>


// let s = Student("Robin", "Breedveld")
// let se = selectableStudent(s)
// let naam = se.select("Name")


// // let model: SelectableEntity<Student>;

// console.log(naam)
// // console.log(test)


interface Student {
  Name:string,
  Surname:string,
  Grades:[
    {
      Grade:number,
      CourseId:number
    }
  ]
}

let Student = (
  Name:string,
  Surname:string,
  Grades:[
    {
      Grade:number,
      CourseId:number
    }
  ]
  ): Student => ({
    Name:Name,
    Surname:Surname,
    Grades:Grades
})

type SelectableEntity<T> = T & {
  select: <K extends keyof T>(this: T, property: K) => T[K]
}

let Selectable = <T>(entity: T): SelectableEntity<T> => ({
  ...entity,
  select: function<K extends keyof T>(property: K): T[K] {
    return Selectable(entity), entity[property]
  }
})

let student: Student = ({
  Name: 'test',
  Surname: 'est',
  Grades: [
      {
          Grade: 10,
          CourseId: 10
      }
  ]
})

// // From T pick a set of properties K

// declare function pick<T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K>;

// const nameAndSurnameOnly = pick(student, "Name", "Surname");  // { name: string, age: number }
// type Picked = Pick<Student, 'Name' | 'Surname'>

let selectableStudent = Selectable(student);

let uitkomst  = selectableStudent.select('Name');
console.log(uitkomst)
// console.log(nameAndSurnameOnly)