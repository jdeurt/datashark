import type {
    BasicShape,
    PrimitiveType,
    Schema,
    SchemaObject,
} from "../../types/shape";
import { Either } from "./either";
import type { Either as EitherType } from "../../types/either";
import type { JSONSchemaType } from "ajv";
import { isEitherTagged } from "./either";

const isPrimitiveAjvSchemaInput = (
    schema: Schema
): schema is
    | boolean
    | number
    | string
    | BooleanConstructor
    | NumberConstructor
    | StringConstructor =>
    typeof schema === "function" ||
    typeof schema === "boolean" ||
    typeof schema === "number" ||
    typeof schema === "string";

const isArrayAjvSchemaInput = (
    schema: Schema
): schema is Schema[] | readonly Schema[] =>
    Array.isArray(schema) && schema.length > 0;

const isObjectAjvSchemaInput = (schema: Schema): schema is SchemaObject =>
    typeof schema === "object" && !Array.isArray(schema);

const isEitherAjvSchemaInput = (schema: Schema): schema is EitherType<Schema> =>
    Array.isArray(schema) && schema.length > 0 && isEitherTagged(schema);

const typeFromPrimitiveSchemaInput = (
    schema:
        | boolean
        | number
        | string
        | BooleanConstructor
        | NumberConstructor
        | StringConstructor
) => {
    if (schema === Boolean || typeof schema === "boolean") {
        return "boolean";
    }

    if (schema === Number || typeof schema === "number") {
        return "number";
    }

    if (schema === String || typeof schema === "string") {
        return "string";
    }

    throw new Error(
        `Invalid value passed as schema. Expected primitive or primitive constructor but received ${String(
            schema
        )}`
    );
};

export const makePrimitiveAjvSchema = <
    T extends
        | boolean
        | number
        | string
        | BooleanConstructor
        | NumberConstructor
        | StringConstructor
>(
    schema: T
): JSONSchemaType<BasicShape & PrimitiveType> => {
    const type = typeFromPrimitiveSchemaInput(schema);

    if (typeof schema !== "function") {
        return {
            type,
            anyOf: [
                {
                    const: schema,
                },
            ],
        };
    }

    return { type };
};

const makeArrayAjvSchema = <T extends readonly Schema[]>(
    schema: T
): JSONSchemaType<BasicShape & unknown[]> => ({
    type: "array",
    items: makeAjvSchema(Either(...schema)),
});

const makeObjectAjvSchema = <T extends SchemaObject>(schema: T) =>
    ({
        type: "object",
        properties: Object.fromEntries(
            Object.entries(schema).map(([key, value]) => [
                key,
                makeAjvSchema(value),
            ])
        ),
    } as JSONSchemaType<BasicShape & Record<string, BasicShape>>);

const makeEitherAjvSchema = <T extends Schema[]>(
    schema: T
): JSONSchemaType<BasicShape> => ({
    anyOf: schema.map((value) => makeAjvSchema(value)),
});

export const makeAjvSchema = <T extends Schema>(
    schema: T
): JSONSchemaType<BasicShape> => {
    if (isPrimitiveAjvSchemaInput(schema)) {
        return makePrimitiveAjvSchema(schema);
    }

    if (isEitherAjvSchemaInput(schema)) {
        return makeEitherAjvSchema(schema);
    }

    if (isArrayAjvSchemaInput(schema)) {
        return makeArrayAjvSchema(schema);
    }

    if (isObjectAjvSchemaInput(schema)) {
        return makeObjectAjvSchema(schema);
    }

    throw new Error(
        `Invalid value passed as schema. Expected primitive, array, or object but received ${String(
            schema
        )}`
    );
};
