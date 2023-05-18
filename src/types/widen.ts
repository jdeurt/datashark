import type { PrimitiveType } from "./shape";

export type Widen<T extends PrimitiveType> = T extends boolean
    ? boolean
    : T extends number
    ? number
    : T extends string
    ? string
    : never;
