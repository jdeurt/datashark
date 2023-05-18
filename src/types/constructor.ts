export type TypeConstructor =
    | (new (...args: never[]) => unknown)
    | ((...args: never[]) => unknown);

export type DeriveTypeFromConstructor<T extends TypeConstructor> = T extends (
    ...args: never[]
) => infer R
    ? R
    : T extends new (...args: never[]) => infer R
    ? R
    : never;
