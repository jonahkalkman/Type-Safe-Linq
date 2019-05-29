"use strict";
/*
UITLEG:

 R {               {                                                 {
     a: int         a:a                                                 a:int
     b: string      b:b       => "a" | "b" => Pick<R, "a"|"b"> =>       b:string                                                                       b:string
     c: bool        c:never                                         }
 }                 }
 Condition = number | string
*/ 
