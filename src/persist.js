export const SCHEMA_VERSION = 2;

export function persistState(state) {
  return JSON.stringify(state);
}

export function hydrateState(state) {
  const parsed = JSON.parse(state);
  if (parsed?.version !== SCHEMA_VERSION) {
    throw Error("Project file not at version " + SCHEMA_VERSION);
  }
  return parsed;
}
