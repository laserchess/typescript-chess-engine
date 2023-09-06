export function inAlternative(alternative: number, wanted: number): boolean {
    return (alternative & wanted) === wanted;
}