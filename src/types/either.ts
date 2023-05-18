import type { _either } from "../lib/helpers/either";

export type Either<T> = T[] & { [_either]: 1 };
