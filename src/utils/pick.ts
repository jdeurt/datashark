type NextKeyFromPath<T, U extends string[]> = U extends [
    infer Head,
    ...infer Tail extends string[]
]
    ? Head extends keyof T
        ? NextKeyFromPath<T[Head], Tail>
        : never
    : keyof T;

type ValueAtPath<T, U extends string[]> = U extends [
    infer Head,
    ...infer Tail extends string[]
]
    ? Head extends keyof T
        ? ValueAtPath<T[Head], Tail>
        : never
    : T;

export const pick = <
    T extends Record<string, unknown>,
    U extends string[],
    V extends string & NextKeyFromPath<T, U>
>(
    obj: T,
    path: [...U, V?]
) => {
    let result: unknown = obj;

    for (const key of path) {
        // @ts-expect-error 18046
        result = result[key];
    }

    return result as ValueAtPath<T, [...U, V]>;
};
