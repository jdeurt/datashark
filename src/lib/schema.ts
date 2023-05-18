import type { DeriveShape, Schema } from "../types/shape";

export const defineSchema = <T extends Schema>(definition: T) => ({
    definition,
    computedShape: {} as DeriveShape<T>,
});
