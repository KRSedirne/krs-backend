
// This function generates a random id for the fields that require an id.
export function generateId(max = 1000000) {
    return Math.floor(Math.random() * max);
}
