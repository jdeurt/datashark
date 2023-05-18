import type { DeriveTypeFromConstructor, TypeConstructor } from "./constructor";
import type { Either } from "./either";
import type { _either } from "../lib/helpers/either";

export type PrimitiveType = boolean | number | string;

export type SchemaArray = Schema[];
export type SchemaTuple = readonly Schema[];

// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
export interface SchemaObject {
    [k: string]: Schema;
}

export type Schema =
    | PrimitiveType
    | TypeConstructor
    | SchemaObject
    | SchemaArray
    | SchemaTuple
    | undefined;

type DerivedShapeArray<S extends Schema[]> =
    S extends (infer E extends Schema)[] ? DeriveShape<E>[] : never;

type DerivedShapeTuple<S extends readonly Schema[]> = S extends readonly [
    infer Head extends Schema,
    ...infer Tail extends readonly Schema[]
]
    ? readonly [DeriveShape<Head>, ...DerivedShapeTuple<Tail>]
    : readonly [];

export type DerivedShapeObject<S extends SchemaObject> = {
    [K in keyof S]: DeriveShape<S[K]>;
};

export type DeriveShape<S extends Schema> =
    // Either
    S extends Either<infer E extends Schema>
        ? DeriveShape<E & { [_either]: never }>
        : // Optionals
        S extends undefined
        ? DeriveShape<Exclude<S, undefined>> | undefined
        : // Primitives
        S extends PrimitiveType
        ? S
        : // Constructors
        S extends TypeConstructor
        ? DeriveTypeFromConstructor<S>
        : // Array
        S extends Schema[]
        ? DerivedShapeArray<S>
        : // Tuple
        S extends readonly Schema[]
        ? DerivedShapeTuple<S>
        : // Object
        S extends SchemaObject
        ? DerivedShapeObject<S>
        : never;

export type BasicShape =
    | boolean
    | number
    | string
    | { [k: string]: BasicShape }
    | BasicShape[]
    | readonly BasicShape[]
    | undefined;
