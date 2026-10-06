import { useEffect, useState } from "react";

function useLocalStorage<T extends string>(
    key: string,
    initialValue: T
) {
    const [value, setValue] = useState<T>(() => {
        const savedValue = localStorage.getItem(key);

        return savedValue
            ? (savedValue as T)
            : initialValue;
    });

    useEffect(() => {
        localStorage.setItem(key, value);
    }, [key, value]);

    return [value, setValue] as const;
}

export default useLocalStorage;