/**
 * `T` if `U` is of type `never`, otherwise `U`.
 */
export type Passthrough<T, U> = U extends never ? T : U;
