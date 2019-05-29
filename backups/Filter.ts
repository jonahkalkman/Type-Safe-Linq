type R = {
    a: number,
    b: never,
    // b: string,
    c: R1,
    // c: R2,
    d: never,
    // d: number,
    e: number
}

// Test
// type Q = R[keyof R]

type R1 = {
    x: number,
    y: number
}

type R2 = {
    x: string
}

type Filter<Source, Condition> =
    Pick<Source, {
        [ att in keyof Source ] :
        Source[att] extends Condition ? att : never
    }[keyof Source]>

type R_filtered = Filter<R, number | string>

/*
UITLEG:

 R {               {                                                 {
     a: int         a:a                                                 a:int
     b: string      b:b       => "a" | "b" => Pick<R, "a"|"b"> =>       b:string                                                                       b:string
     c: bool        c:never                                         }
 }                 }
 Condition = number | string
*/