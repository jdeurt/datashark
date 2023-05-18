export function assertInternalAttribute<T extends object, U extends symbol>(
    base: T,
    attribute: U
): asserts base is T & Record<U, 1> {
    //@ts-expect-error 2536
    base[attribute] = 1;
}

export function setInternalAttribute<T extends object, U extends symbol>(
    base: T,
    attribute: U
) {
    assertInternalAttribute(base, attribute);

    return base;
}
