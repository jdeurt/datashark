/**
 * Removes the readonly modifier from a type.
 */
export type StripReadonly<T> = {
    -readonly [K in keyof T]: T[K] extends { [P in keyof T[K]]: infer U }
        ? StripReadonly<U>
        : T[K];
};
