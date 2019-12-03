export function isLowerCase(char: string) {
    if (char.length > 1) {
        throw new Error('Only 1 letter is allowed.');
    }

    const charCode = char.charCodeAt(0);

    return charCode <= 122 && charCode >= 97;
}

export function isUpperCase(char: string) {
    if (char.length > 1) {
        throw new Error('Only 1 letter is allowed.');
    }

    const charCode = char.charCodeAt(0);

    return charCode <= 90 && charCode >= 65;
}