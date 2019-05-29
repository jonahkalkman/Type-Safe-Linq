type student = {
    age: number,
    name: string
}

type Filter<Source, Condition> =
    Pick<Source, {
        [ att in keyof Source ] :
        Source[att] extends Condition ? att : never
    }[keyof Source]>

type student_filtered = Filter<student, number | string>