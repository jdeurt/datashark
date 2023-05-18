import test from "ava";
import { expectTypeOf } from "expect-type";

import { defineSchema } from "../src/lib/schema";
import { Either } from "../src/lib/helpers/either";
import { Optional } from "../src/lib/helpers/optional";

test("Should compute shape type from schema.", (t) => {
    const schema = defineSchema({
        a: Number,
        b: Boolean,
        c: String,
        d: "Hello",
        e: "Hello" as const,
        f: 10,
        g: 10 as const,
        h: Either(1, 2),
        i: Optional([1, 2, 3]),
        j: Optional([1, 2, 3] as const),
        k: [String],
        l: ["a", "b"],
        m: ["a" as const, "b" as const],
        n: ["a", "b"] as const,
        o: [String, String] as const,
        p: {
            a: Either("a", "b"),
        },
        q: [true, true] as const,
        r: Uint16Array,
    });

    t.assert(
        expectTypeOf(schema.computedShape).toMatchTypeOf<{
            a: number;
            b: boolean;
            c: string;
            d: string;
            e: "Hello";
            f: number;
            g: 10;
            h: 1 | 2;
            i: number[] | undefined;
            j: readonly [1, 2, 3] | undefined;
            k: string[];
            l: string[];
            m: ("a" | "b")[];
            n: readonly ["a", "b"];
            o: readonly [string, string];
            p: {
                a: "a" | "b";
            };
            q: readonly [true, true];
            r: Uint16Array;
        }>()
    );
});
