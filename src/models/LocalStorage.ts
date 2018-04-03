export const loadState = () => {
    try {
        const serializedState = localStorage.getItem(
            process.env.REACT_APP_LOCAL_STORAGE_KEY_PREPEND + "state",
        );
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
};

export const saveState = (state: any) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem(
            process.env.REACT_APP_LOCAL_STORAGE_KEY_PREPEND + "state",
            serializedState,
        );
    } catch (err) {
        // console.log(err);
    }
};
