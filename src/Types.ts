import * as Utils from './Utils';

export interface Student {
    Name: string,
    Surname: string,
    Grades:Array<Grades>,
    ExtraArray:Array<ExtraArray>,
    StudentNumber:number
}

export interface Grades {
    Grade: number;
    CourseId: number;
}

export interface ExtraArray {
    item1: string,
    item2: string
}

export type Selectable<T, B> = {
    object: Array<T>,
    select: <K extends keyof T>(...entities: Array<K>) => Queryable<Utils.omit<T, K>, Pick<T, K>, Utils.excludeArray<Pick<T,K>>>
}

export type Queryable<T, R, B> = {
    object: Array<T>,
    result: Array<R>,
    select: <K extends keyof T>(...selectedEntites: Array<K>) => Queryable<Utils.omit<T, K> , R & Pick<T, K>, B & Utils.excludeArray<Pick<T,K>>>,
    include: <K extends keyof Utils.includeArrays<T>, s, r, b>(
        entity: K,
        query: (selectable: Selectable<Utils.getKeysFromArray<T, K>, B>) => Queryable<s, r, b> | orderbyResult<r>
    ) => Queryable<Utils.omit<T, K>, R & { [key in K]: Array<r> }, B>,
    orderBy: <H extends keyof B>(type: 'ASC' | 'DESC', entity: H) => orderbyResult<R>
}

export type orderbyResult<R> = {
    result: Array<R>
}
