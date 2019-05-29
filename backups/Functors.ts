interface Func<T, U> {
  func: (_: T) => U
  call: (this: Func<T, U>, x: T) => U
  then: <V>(this: Func<T, U>, g: Func<U, V>) => Func<T, V>
}

let Func = <T, U>(f: (_: T) => U): Func<T, U> => ({
  func: f,
  call: function(this: Func<T, U>, x: T) {
    return this.func(x)
  },
  then: function<V>(this: Func<T, U>, g: Func<U, V>): Func<T, V> {
    return Func((x: T) => g.call(this.call(x)))
  }
})

type Option<T> = {
  kind: "None"
} | {
  kind: "Some",
  value: T
}

let None = <T>(): Option<T> => ({ kind: "None" })
let Some = <T>(value: T): Option<T> => ({
  kind: "Some",
  value: value
})

type List<T> = {
  kind: "Empty"
} | {
  kind: "Cons",
  head: T,
  tail: List<T>
}

let Empty = <T>(): List<T> => ({ kind: "Empty" })
let Cons = <T>(head: T, tail: List<T>): List<T> => ({
  kind: "Cons",
  head: head,
  tail: tail
})



interface Kinds<T> {
  Option: Option<T>
  List: List<T>
}

type HigherOrderTypes<K extends keyof Kinds<T>, T> = Kinds<T>[K]
type OptionKind<T> = HigherOrderTypes<"Option", T>

interface Functor<K extends keyof Kinds<T>, T> {
  map: <U>(f: Func<T, U>) =>
   Func<HigherOrderTypes<K, T>, HigherOrderTypes<K, U>>
}

type OptionFunctor<T> = Option<T> & Functor<"Option", T>

let OptionFunctor = <T>(option: Option<T>): OptionFunctor<T> => ({
  ...option,
  map: <U>(f: Func<T, U>): Func<Option<T>, Option<U>> =>
    Func((opt: Option<T>): Option<U> => {
      if (opt.kind == "None") {
        return None<U>()
      }
      else {
        return Some<U>(f.call(opt.value))
      }
    } )
})