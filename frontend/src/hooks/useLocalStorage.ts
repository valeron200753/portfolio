import { useEffect, useState } from "react";

function useLocalStorage<T>(
    key: string,
    initialValue: T
) {
    const [value, setValue] = useState<T>(() => {
        const savedValue = localStorage.getItem(key);

        if (savedValue === null) {
            return initialValue;
        }

        try {
            return JSON.parse(savedValue) as T;
        } catch {
            // Підтримка старих значень, збережених як звичайні рядки
            if (typeof initialValue === "string") {
                return savedValue as T;
            }

            return initialValue;
        }
    });

    useEffect(() => {
        localStorage.setItem(
            key,
            JSON.stringify(value)
        );
    }, [key, value]);

    return [value, setValue] as const;
}

export default useLocalStorage;