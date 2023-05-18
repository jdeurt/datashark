import type { BasicShape, DeriveShape, SchemaObject } from "../../types/shape";
import Ajv from "ajv";
import type { StringValueStorageConfig } from "../../types/structs/string-value-storage";
import type { ValidateFunction } from "ajv";
import { makeAjvSchema } from "../helpers/ajv";

const serializeAndStore = (
    key: string,
    value: unknown,
    config: StringValueStorageConfig,
    validators: Record<string, ValidateFunction>
) => {
    if (
        config.useRuntimeValidation === true &&
        config.runtimeValidationOptions?.validationDirection !== "out" // Either "in" or "both" (default "both")
    ) {
        const validator = validators[key];

        if (!validator(value)) {
            const message = `Value for key "${key}" failed validation: ${
                validator.errors?.map((error) => error.message).join(", ") ??
                "unknown error"
            }`;

            if (config.runtimeValidationOptions?.fatalErrors === true) {
                throw new Error(message);
            }

            console.error(message);

            return;
        }
    }

    return config.storage.setItem(key, JSON.stringify(value));
};

const retrieveAndDeserialize = (
    key: string,
    config: StringValueStorageConfig,
    validators: Record<string, ValidateFunction>
) => {
    const parsedValue = JSON.parse(config.storage.getItem(key) ?? "null") as
        | unknown;

    if (
        config.useRuntimeValidation === true &&
        config.runtimeValidationOptions?.validationDirection !== "in" // Either "out" or "both" (default "both")
    ) {
        const validator = validators[key];

        if (!validator(parsedValue)) {
            const message = `Value for key "${key}" failed validation: ${
                validator.errors?.map((error) => error.message).join(", ") ??
                "unknown error"
            }`;

            if (config.runtimeValidationOptions?.fatalErrors === true) {
                throw new Error(message);
            }

            console.error(message);

            return;
        }
    }

    return parsedValue;
};

export const storageWrapper = <T extends SchemaObject>(
    schemaDefinition: T,
    config: StringValueStorageConfig
) => {
    type S = DeriveShape<T>;

    const storage = config.storage;

    const ajv = new Ajv();

    const validators = Object.fromEntries(
        Object.entries(schemaDefinition).map(([key, value]) => [
            key,
            ajv.compile(makeAjvSchema(value)),
        ])
    );

    const methods = {
        clear: () => storage.clear(),

        get: <K extends string & keyof S>(key: K) =>
            (retrieveAndDeserialize(key, config, validators) ?? undefined) as
                | S[K]
                | undefined,

        key: (index: number) =>
            (storage.key(index) ?? undefined) as S[keyof S] | undefined,

        remove: <K extends string & keyof S>(key: K) => storage.removeItem(key),

        set: <K extends string & keyof S>(key: K, value: S[K]) =>
            serializeAndStore(key, value, config, validators),

        shape: {} as S,
    };

    return methods as S extends BasicShape ? typeof methods : never;
};
