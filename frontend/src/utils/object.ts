export const ensureArray = (input: any) => {
    if (typeof input === 'object' && input !== null && !Array.isArray(input)) {
        return [input];
    }
    if (Array.isArray(input)) {
        return input;
    } else {
        throw new Error("Input is not an object or an array.");
    }
}