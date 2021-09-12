

export function persistState(state) {
    return JSON.stringify(state)
};

export function hydrateState(state) {
    return JSON.parse(state)
};
