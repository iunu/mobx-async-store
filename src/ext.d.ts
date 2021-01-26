// eslint-disable-next-line no-unused-vars
interface Function {
    type: string,
    types: any
}

interface Array<T> {
    includes(searchElement: any, fromIndex?: number): searchElement is T;
}
