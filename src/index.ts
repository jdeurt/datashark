import { defineSchema } from "./lib/schema";
import { storageWrapper } from "./lib/wrappers/storage";
import { Optional } from "./utils/optional";

enum UserRole {
    ROOT,
    ADMIN,
    USER,
}

const userSchema = defineSchema({
    id: String,
    name: {
        first: String,
        middle: Optional(String),
        last: String,
    },
    role: UserRole,
    permissions: [Number, String] as const,
});

const localStorage = storageWrapper(window.localStorage, {
    data: {
        users: userSchema.definition,
    },
});

localStorage.get("data")?.;
