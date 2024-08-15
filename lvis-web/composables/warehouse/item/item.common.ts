

export function generateNumbersBy5(p: { max: number }) {
    const result = [];
    for (let i = 1; i <= p.max / 5; i++) {
        result.push(i * 5);
    }
    return result;
}