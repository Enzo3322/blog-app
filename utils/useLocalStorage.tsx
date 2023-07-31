import { useState } from 'react';

export const useLocalStorage = (key: string, initialValue: string) => {
    const isLocalStorageSupported = typeof Storage !== 'undefined';

    const [state, setState] = useState(() => {
        if (isLocalStorageSupported) {
            const storedValue = localStorage.getItem(key);
            return storedValue ? JSON.parse(storedValue) : initialValue;
        }
        return initialValue;
    });

    const updateState = (newValue: string) => {
        if (isLocalStorageSupported) {
            localStorage.setItem(key, JSON.stringify(newValue));
        }
        setState(newValue);
    };

    return [state, updateState];
};

