import test from "ava";

import { makeAjvSchema } from "../src/lib/helpers/ajv";
import { Either } from "../src/lib/helpers/either";
import { Optional } from "../src/lib/helpers/optional";
import Ajv from "ajv";

test("Should compute shape type from schema.", (t) => {
    const schema = makeAjvSchema({
        a: Number,
        b: Boolean,
        c: String,
        e: "Hello" as const,
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
    });

    const ajv = new Ajv();

    t.true(
        ajv.validate(schema, {
            a: 1,
            b: true,
            c: "Hi",
            e: "Hello",
            g: 10,
            h: 1,
            i: [1, 2, 3],
            j: [1, 2, 3],
            k: ["a", "b"],
            l: ["a", "b"],
            m: ["a", "b"],
            n: ["a", "b"],
            o: ["a", "b"],
            p: {
                a: "a",
            },
            q: [true, true],
        })
    );

    t.false(
        ajv.validate(schema, {
            a: 1,
            b: true,
            c: "Hi",
            e: "Hello2",
        })
    );

    t.true(
        ajv.validate(schema, {
            a: 1,
            b: true,
            c: "Hi",
            e: "Hello",
        })
    );
});
