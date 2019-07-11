export type Fun<a,b> = {
    f : (_:a) => b
    then : <c>(g:Fun<b,c>) => Fun<a,c>
}

export let fun = <a,b>(f : (_:a) => b) : Fun<a,b> => ({
    f : f,
    then : function<c>(this:Fun<a,b>, g:Fun<b,c>) : Fun<a,c> {
        return then(this, g)
    }
});

export const then = <a,b,c>(f:Fun<a,b>, g:Fun<b,c>) : Fun<a,c> => fun<a,c>(a => g.f(f.f(a)))

export const pick = <T, K extends keyof T>(keys: Array<K>): Fun<T, Pick<T, K>> => (
    fun(object =>
        keys.map(key => key in object ? { [key]: object[key] } : {})
        .reduce((res, o) => ({ ...res, ...o }), {}) as Pick<T, K>
    )
);

export const getKeysFromObject = <T>(object: T): Array<keyof T> => Object.keys(object) as Array<keyof T>

export type omit<T, Conditions extends keyof T> = Pick<T, {
    [K in keyof T]: K extends Conditions ? never : K
}[keyof T]>

export const omit = <T, K extends keyof T>(keys: Array<keyof T>): Fun<T, omit<T, K>> => (
    fun(object =>
        getKeysFromObject(object).map(key => (keys as Array<keyof T>).includes(key) ? {} : { [key]: object[key] })
        .reduce((res, o) => ({ ...res, ...o }), {}) as omit<T, K>
    )
);

export type includeArrays<T> = Pick<T, {
    [K in keyof T]: T[K] extends Array<object> ? K : never
}[keyof T]>;


export type excludeArray<T> = Pick<T, {
    [K in keyof T]: T[K] extends Array<object> ? never : K
}[keyof T]>;

export type getKeysFromArray<T, K extends keyof includeArrays<T>> = T[K] extends Array<infer U> ? U : never;

export type Unit = {}

export let Unit : Unit = {}

export function sortArray(property: any, type: any) {
    var sortOrder = type === 'ASC' ? 1 : -1;
    return function (a: any ,b: any) {
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
