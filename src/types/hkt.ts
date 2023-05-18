export interface HKT {
    readonly _A?: unknown;
    readonly _B?: unknown;
    readonly _C?: unknown;
    readonly type?: unknown;
}

export type Kind<F extends HKT, A, B = unknown, C = unknown> = F extends {
    readonly type: unknown;
}
    ? (F & { readonly _A: A; readonly _B: B; readonly _C: C })["type"]
    : {
          readonly _F: F;
          readonly _A: () => A;
          readonly _B: () => B;
          readonly _C: () => C;
      };

interface ArrayHKT extends HKT {
    readonly type: this["_A"][];
}

type A = Kind<ArrayHKT, number>;

export interface TypeClass<F extends HKT> {
    readonly _F?: F;
}
