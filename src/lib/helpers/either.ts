import type { Either as EitherType } from "../../types/either";
import type { Schema } from "../../types/shape";
import { assertInternalAttribute } from "../../utils/merge";

export const _either: unique symbol = Symbol("ds:schema:either");

export const Either = <T extends Schema>(...args: T[]) => {
    const options = args;

    assertInternalAttribute(options, _either);

    return options as EitherType<T>;
};

export const isEitherTagged = <T>(value: T[]): value is EitherType<T> => {
    return Reflect.has(value, _either);
};
