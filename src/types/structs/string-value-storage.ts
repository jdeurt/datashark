export interface StringValueStorageConfig {
    storage: Storage;
    useRuntimeValidation?: boolean;
    runtimeValidationOptions?: {
        fatalErrors?: boolean;
        validationDirection?: "in" | "out" | "both";
    };
}

export interface StringValueStorageConfigDefaults {
    storage: Storage;
    useRuntimeValidation: false;
    runtimeValidationOptions: {
        fatalErrors: false;
        validationDirection: "both";
    };
}
