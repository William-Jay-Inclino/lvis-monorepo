import type { ComplaintStatus } from "./complaints.types";


export function generateReferenceNumber(lastRefNumber: string | null): string {
    const currentYear = new Date().getFullYear().toString().slice(-2);

    if (lastRefNumber) {
        const lastNumericPart = parseInt(lastRefNumber.slice(-5), 10);
        const newNumericPart = lastNumericPart + 1;
        return `${currentYear}-${newNumericPart.toString().padStart(5, '0')}`;
    } else {
        // If no last RC number is provided, start with '00001'
        return `${currentYear}-00001`;
    }
}


export function generateRandomId() {
    return Date.now() + Math.floor(Math.random() * 1000); // Ensures uniqueness
};