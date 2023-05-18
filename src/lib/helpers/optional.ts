import type { Optional as OptionalType } from "../../types/optional";
import type { Schema } from "../../types/shape";

export const Optional = <T extends Schema>(value: T) =>
    value as OptionalType<T>;
