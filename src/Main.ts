import * as Utils from './Utils';
import * as Types from './Types';

export const orderbyResult = function<R>(result: Array<R>) : Types.orderbyResult<R> {
    return {
        result: result
    }
}

export const Selectable = function<T, B>(object: Array<T>) : Types.Selectable<T, B> {
    return {
        object: object,
        select: function<K extends keyof T>(...entities: Array<K>) : Types.Queryable<Utils.omit<T, K>, Pick<T, K>, Utils.excludeArray<Pick<T,K>>> {

            let newResult = <any>([]);
            const objectLength = object.length;
            for(let i = 0; i < objectLength; i++){
                if(Array.isArray(object[i]) && Object.keys(object[i]).length > 1){
                    let subArray: any = object[i] as any
                    newResult[i] = []
                    for(let g = 0; g < subArray.length; g++){
                        newResult[i].push(Utils.pick<T,K>(entities).f(subArray[g]))
                    }
                }
                else {
                    newResult[i] = Utils.pick<T,K>(entities).f(object[i])
                }
            }

            const newObject = <any>([])
            object.forEach(element => { newObject.push(Utils.omit<T, K>(entities).f(element)); });

            return Queryable<Utils.omit<T, K>, Pick<T, K>, Utils.excludeArray<Pick<T,K>>>(newObject, newResult);
        }
    }
}

export const Queryable = function<T, R, B>(object: Array<T>, result: Array<R>) : Types.Queryable<T, R, B> {
    return {
        object: object,
        result: result,
        select: function<K extends keyof T>(...selectedEntites: Array<K>) : Types.Queryable<Utils.omit<T, K>, R & Pick<T, K>, B & Utils.excludeArray<Pick<T,K>>> {

            let newResult = <any>([]);
            const objectLength = object.length;
            for(let i = 0; i < objectLength; i++){
                newResult[i] = {
                    ...(<any>result)[i],
                    ...Utils.pick<T,K>(selectedEntites).f(object[i])
                }
                // For selectedEntites that are an Array
                if((<any>object)[i][0]) {
                    newResult[i] = []
                    for(let g = 0; g < Object.keys((<any>object)[i]).length; g++) {
                        newResult[i][g] = {
                            ...(<any>result)[i][g],
                            ...Utils.pick<T,K>(selectedEntites).f((<any>object)[i][g])
                        };
                    }
                }
            }

            const newObject = <any>([])
            object.forEach(element => { newObject.push(Utils.omit<T, K>(selectedEntites).f(element)); });

            return Queryable<Utils.omit<T, K>, R & Pick<T, K>, B & Utils.excludeArray<T>>(newObject, newResult);
        },
        include: function<K extends keyof Utils.includeArrays<T>, s, r, b>(
            entity: K,
            query: (selectable: Types.Selectable<Utils.getKeysFromArray<T, K>, B>) => Types.Queryable<s, r, b> | Types.orderbyResult<r>
        ) : Types.Queryable<Utils.omit<T, K>, R & { [key in K]: Array<r> }, B> {

            const entityInArray: Array<K> = [];
            entityInArray.push(entity);
            const newObject = <any>([])
            object.forEach(element => { newObject.push(Utils.omit<T, K>(entityInArray).f(element)); });

            const keysFromEntity = <any>([])
            object.forEach(element => { keysFromEntity.push((<any>element)[entity]); })

            const selectableFromEntity: Types.Selectable<Utils.getKeysFromArray<T, K>, B> = Selectable(keysFromEntity);

            const queryResult = query(selectableFromEntity).result;

            let newResult = <any>([]);
            const objectLength = object.length;
            for(let i = 0; i < objectLength; i++){
                newResult[i] = {
                    ...(<any>result)[i],
                    ...{ [entity]:(<any>queryResult)[i] } as {[key in K]: Array<r> }
                }
            }

            return Queryable<Utils.omit<T, K>, R & { [key in K]: Array<r> }, B>(newObject, newResult);
        },
        orderBy: function<H extends keyof B>(type: 'ASC' | 'DESC', entity: H): Types.orderbyResult<R> {
            const newResult = result as any
            let orderedNewResult: Array<R> = result;

            // For entities that are an array
            if(newResult[0][entity]){
                orderedNewResult = (<any>result).sort(Utils.sortArray(entity,type));
            }
            else {
                const newResultLength = newResult.length
                for (let index = 0; index < newResultLength; index++) {
                    const element = newResult[index];
                    (<any>element).sort(Utils.sortArray(entity,type))
                }
            }
            return orderbyResult(orderedNewResult)
        }
    }
}
