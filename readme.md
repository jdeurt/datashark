# Datashark

> Storage API wrappers for the browser that don't suck.

## Intro

Datashark is a library that allows you to work with type-safe Storage and IDB objects. Before we get started, lets get some definitions out of the way.

**DSStorage**: DSStorage refers to the datashark storage instance wrapping around your native `Storage` or `IDB` instances.

**shape**: Shape refers to the type structure that your DSStorage instance should follow.

**schema**: Schema refers to any native JS value that can are used to validate input/output and to compute the shape of your DSStorage instance. Schema usually refers to JS objects, but single values can also be valid schema.

**modifier**: A modifier is a function exported by datashark that, given any schema input, modifies the schema's resulting computed shape and the schema itself.

## Schema definitions

Datashark uses (and abuses) typescript to infer the shape of your storage data from JS object definitions.

```ts
import { defineSchema } from "datashark";

const schema = defineSchema({
    foo: String,
    bar: Boolean,
});
```

In the above example, `schema.definition` will be a reference to the object passed as an argument. `schema.computedShape` holds the computed shape type.

### Schema definition syntax

| Category            | Input                        | Derived type           |
| ------------------- | ---------------------------- | ---------------------- |
| Primitives          | `Boolean`                    | `boolean`              |
|                     | `Number`                     | `number`               |
|                     | `String`                     | `string`               |
| Primitive constants | `true as const`              | `true`                 |
|                     | `1 as const`                 | `1`                    |
|                     | `"abc" as const`             | `"abc"`                |
| Arrays              | `[Number]`                   | `number[]`             |
|                     | `[String, Number]`           | `(string \| number)[]` |
| Tuples              | `[String, Boolean] as const` | `[string, boolean]`    |
| Objects             | `{ foo: [String] }`          | `{ foo: string }`      |
| Optionals           | `Optional(Boolean)`          | `boolean \| undefined` |
| Unions              | `Either("a", "b", "c")`      | `"a" \| "b" \| "c"`    |

#### Primitive types

Primitive constructors are computed as their type equivalents.

**Input:**

```ts
{
    foo: Number,
    bar: String,
    baz: Boolean,
};
```

**Result:**

```ts
type Shape = {
    foo: number;
    bar: string;
    baz: boolean;
};
```

#### Primitive constants

Due to how Typescript's type inferrence works, constants must be defined with `as const`.

**Input:**

```ts
{
    foo: 1 as const,
    bar: "abc" as const,
};
```

**Result:**

```ts
type Shape = {
    foo: 1;
    bar: "abc";
};
```

#### Arrays

Arrays are defined by surrounding a schema definition in brackets (`[Number]`). Mixed-type arrays are supported as well.

**Input:**

```ts
{
    foo: [Number],
    bar: [String, Number],
};
```

**Result:**

```ts
type Shape = {
    foo: number[];
    bar: (string | number)[];
};
```

#### Tuples

Tuple definitions are similar to arrays. The only difference is the need to append an `as const` modifier.

**Input:**

```ts
{
    foo: [Number] as const,
    bar: [String, Number] as const,
};
```

**Result:**

```ts
type Shape = {
    foo: [number];
    bar: [string, number];
};
```

#### Nested objects

Datashark supports schema nesting.

**Input:**

```ts
{
    foo: {
        bar: 0 as const;
    }
}
```

**Result:**

```ts
type Shape = {
    foo: {
        bar: 0;
    };
};
```

#### Nested schema definitions

Since schema definitions are just normal JS objects with fancy types, you can defined your schema somewhere and use it somewhere else.

```ts
const schema1 = defineSchema({
    x: 1 as const,
    y: Boolean,
});

const schema2 = defineSchema({
    nested: schema1.definition,
    z: [String, String] as const,
});
```

The above code results in `schema2` having the following computed shape:

```ts
type Shape = {
    nested: {
        x: 1;
        y: boolean;
    };
    z: [string, string];
};
```

#### Optional fields

You can mark a field as optional by using the exported `Optional` modifier function.

**Input:**

```ts
{
    foo: {
        bar: Optional(0 as const);
    }
}
```

**Result:**

```ts
type Shape = {
    foo: {
        bar: 0 | undefined;
    };
};
```

#### Union fields

You can specify that a field should be any 1 of a collection of types by using the `Either` modifier.

**Input:**

```ts
{
    foo: Either(1, 2);
}
```

**Result:**

```ts
type Shape = {
    foo: 1 | 2;
};
```

## Extracting computed shape types

You can extract the computed shape of a schema by using the `typeof` operator on the `computedShape` property of the object returned by `defineSchema`.

Note that `computedShape` is actually an empty object asserted to be of type `DeriveShape<Schema>`. Attempting to access the properties defined by its type will always result in an `undefined` value.

```ts
type Shape = typeof schema.computedShape;
```

## TODO - finish documentation

## License

MIT © [Juan de Urtubey](https://jdeurt.xyz)
