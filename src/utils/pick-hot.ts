import type { Call, Fn, Tuples } from "hotscript";

interface PickReducer extends Fn {
    return: this["arg0"][this["arg1"]];
}

type Pick<T, U extends string[]> = Call<Tuples.Reduce<PickReducer, T>, U>;

declare const pick: <
    T extends Record<string, unknown>,
    U extends string[],
    V extends string & keyof Pick<T, U>
>(
    obj: T,
    path: [...U, V?]
) => Pick<T, [...U, V]>;

pick(
    {
        a: {
            b: {
                c: 1,
            },
        },
    },
    ["a", "b"]
);
