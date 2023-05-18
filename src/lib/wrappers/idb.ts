import type { DeriveShape, SchemaObject } from "../../types/shape";

export const idbWrapper = <T extends SchemaObject>(
    name: string,
    version: number,
    schema: T,
    keyPath: string & keyof T,
    indexes?: { key: string & keyof T; unique?: boolean }[]
) => {
    type S = DeriveShape<T>;

    const dbOpenRequest = indexedDB.open(name, version);

    dbOpenRequest.addEventListener("upgradeneeded", (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        const store = db.createObjectStore(name, {
            keyPath,
        });

        for (const { key, unique } of indexes ?? []) {
            store.createIndex(key, key, { unique });
        }
    });

    return {
        get: async <K extends string & keyof S>(key: K) => {
            const db = await new Promise<IDBDatabase>((resolve, reject) => {
                dbOpenRequest.addEventListener("success", () => {
                    resolve(dbOpenRequest.result);
                });

                dbOpenRequest.addEventListener("error", () => {
                    reject(dbOpenRequest.error);
                });
            });

            const transaction = db.transaction(name, "readonly");
            const store = transaction.objectStore(name);
            const request = store.get(key);

            return new Promise<S[K]>((resolve, reject) => {
                request.addEventListener("success", () => {
                    resolve(request.result as S[K]);
                });

                request.addEventListener("error", () => {
                    reject(request.error);
                });
            });
        },

        set: async <K extends string & keyof S>(key: K, value: S[K]) => {
            const db = await new Promise<IDBDatabase>((resolve, reject) => {
                dbOpenRequest.addEventListener("success", () => {
                    resolve(dbOpenRequest.result);
                });

                dbOpenRequest.addEventListener("error", () => {
                    reject(dbOpenRequest.error);
                });
            });

            const transaction = db.transaction(name, "readwrite");
            const store = transaction.objectStore(name);
            const request = store.put(value);

            return new Promise<void>((resolve, reject) => {
                request.addEventListener("success", () => {
                    resolve();
                });

                request.addEventListener("error", () => {
                    reject(request.error);
                });
            });
        },
    };
};
