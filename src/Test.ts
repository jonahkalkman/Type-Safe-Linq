import { Student } from './Types';
import { Selectable } from './Main';

let Student: Student = ({
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
    ExtraArray:[{
        item1: 'a',
        item2: 'a'
    },
    {
        item1: 'b',
        item2: 'b'
    }
    ]
});

let StudentTwo: Student = ({
    Name: 'Erik',
    StudentNumber: 1.2,
    Surname: 'Pieters',
    Grades: [{
        Grade: 3,
        CourseId: 6,
    },
    {
        Grade: 4,
        CourseId: 4,
    }],
    ExtraArray:[{
        item1: 'a',
        item2: 'a'
    },
    {
        item1: 'b',
        item2: 'b'
    }]
});

let StudentThree: Student = ({
    Name: 'Henk',
    StudentNumber: 6.7,
    Surname: 'Pietje',
    Grades: [{
        Grade: 7,
        CourseId: 4,
    },
    {
        Grade: 2,
        CourseId: 1,
    }],
    ExtraArray:[{
        item1: 'a',
        item2: 'a'
    },
    {
        item1: 'b',
        item2: 'b'
    }]
});

let StudentFour: Student = ({
    Name: 'Jan',
    StudentNumber: 8.9,
    Surname: 'Dijk',
    Grades: [{
        Grade: 5.5,
        CourseId: 9,
    },
    {
        Grade: 2,
        CourseId: 9,
    }],
    ExtraArray:[{
        item1: 'a',
        item2: 'a'
    },
    {
        item1: 'b',
        item2: 'b'
    }]
});

let students = [Student, StudentTwo, StudentThree, StudentFour]
let selectableStudents = Selectable<Student, Student>(students);
let selection = selectableStudents
    .select('Name', 'Grades').select('StudentNumber', 'Surname')
    .include('ExtraArray', t => t.select('item2')
        .orderBy('ASC', 'item2')).orderBy('ASC', 'Surname')
    .result

// Pretty print the result
console.log('QueryResult', JSON.stringify( selection, null, 4));
