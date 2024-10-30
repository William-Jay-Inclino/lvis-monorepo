import moment from "moment";
import { VAT_TYPE } from "#imports";
import { APPROVAL_STATUS } from "#imports";


export function getFullname(firstname: string, middlename: string | null, lastname: string) {
    if (middlename) {
        return lastname + ', ' + firstname + ' ' + convertMiddleNameToInitial(middlename)
    }
    return lastname + ', ' + firstname
}

export function convertMiddleNameToInitial(middleName: string) {
    if (middleName && middleName.length > 0) {
        return middleName.charAt(0).toUpperCase() + ".";
    } else {
        return "";
    }
}

export function formatDate(d: any, withTime: boolean = false) {

    if (!d) {
        return ""
    }

    let date = d;
    if (!isNaN(d)) {
        date = Number(d) < 10000000000 ? Number(d) * 1000 : Number(d);
    }

    return withTime ? moment(date).format('DD MMM YYYY, h:mm A') : moment(date).format('DD MMM YYYY');
}

export function formatTimeTo12Hour(date: Date): string {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // The hour '0' should be '12'
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;

    return `${hours}:${minutesStr} ${ampm}`;
}

export function formatToValidHtmlDate(d: any, hasTime: boolean = false): string {

    let date = d;
    if (!isNaN(d)) {
        date = Number(d) < 10000000000 ? Number(d) * 1000 : Number(d);
    }

    const formatString = hasTime ? 'YYYY-MM-DDTHH:mm' : 'YYYY-MM-DD';
    return moment(date).format(formatString);
}

export function isValidDate(dateString: string | null): boolean {

    if (!dateString) {
        return false
    }

    // Parse the date string
    let date = new Date(dateString);

    // Check if the parsed date is a valid date
    return !isNaN(date.getTime());
}

export function formatToPhpCurrency(number: number) {
    return "₱" + number.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function getVatAmount(price: number, vat_type: VAT_TYPE): number {

    if (!price) return 0

    if (vat_type === VAT_TYPE.EXC) {
        return price * VAT_RATE
    }

    if (vat_type === VAT_TYPE.INC) {
        return (price * VAT_RATE) / (1 + VAT_RATE);
    }

    return 0

}

export function getNetPrice(payload: { grossPrice: number, vatAmount: number, vatType: VAT_TYPE }): number {
    const { grossPrice, vatAmount, vatType } = payload

    if(vatType === VAT_TYPE.NONE) {
        return grossPrice
    }

    if(vatType === VAT_TYPE.EXC) {
        return grossPrice + vatAmount
    }

    if(vatType === VAT_TYPE.INC) {
        return grossPrice - vatAmount
    }

    return 0

}

export function getTotalNetPrice(payload: { pricePerUnit: number, quantity: number, vatPerUnit: number, vatType: VAT_TYPE }): number {

    const { pricePerUnit, quantity, vatPerUnit, vatType } = payload

    const totalPrice = pricePerUnit * quantity
    const totalVat = vatPerUnit * quantity

    if(vatType === VAT_TYPE.NONE) {
        return totalPrice
    }

    if(vatType === VAT_TYPE.EXC) {
        return totalPrice + totalVat
    }

    if(vatType === VAT_TYPE.INC) {
        return totalPrice - totalVat
    }

    return 0

}

export function getVatTotal(payload: { price: number, quantity: number, vatType: VAT_TYPE }) {

    const { price, quantity, vatType } = payload
    const vatPerUnit = getVatAmount(price, vatType)
    return vatPerUnit * quantity

}

export function getGrossTotal(payload: { price: number, quantity: number }) {
    const { price, quantity } = payload

    return (price * quantity)

}

export function redirectTo401Page() {
    const router = useRouter()
    router.push('/error/401')
    // return window.location.href = '/error/401'
}

export function debounce<T extends (...args: any[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return function(...args: Parameters<T>): void {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
}
  

// status should be blank if nay nag una nga approver nga ni disapproved. Meaning wala na abot sa ilaha ang document

export function isBlankStatus(itemStatus: APPROVAL_STATUS, approverStatus: APPROVAL_STATUS) {

    if((itemStatus === APPROVAL_STATUS.DISAPPROVED || itemStatus === APPROVAL_STATUS.CANCELLED) && approverStatus === APPROVAL_STATUS.PENDING) {
        return true 
    }

    return false 

}

export function logout() {
    localStorage.removeItem('authUser');
}

export function isValidRcNumber(input: string) {
    const regex = /^\d{2}-\d{5}$/;
    return regex.test(input);
}


export function showORnumber(request_type_id: number): boolean { 
    const x = [
        WAREHOUSE_REQUEST_TYPE.TURN_ON_ORDER,
        WAREHOUSE_REQUEST_TYPE.CONSTRUCTION_WORK_ORDER,
        WAREHOUSE_REQUEST_TYPE.EMERGENCY_WITHDRAW,
        WAREHOUSE_REQUEST_TYPE.SERVICE_REQUEST_ORDER,
        WAREHOUSE_REQUEST_TYPE.HW_KIT_FABRICATED,
    ]

    return x.includes(request_type_id)
}

export function showMWOnumber(request_type_id: number): boolean { 
    const x = [
        WAREHOUSE_REQUEST_TYPE.MAINTENANCE_WORK_ORDER,
        WAREHOUSE_REQUEST_TYPE.STOCK_TRANSFER,
    ]

    return x.includes(request_type_id)
}

export function showCWOnumber(request_type_id: number): boolean { 
    const x = [
        WAREHOUSE_REQUEST_TYPE.CONSTRUCTION_WORK_ORDER,
    ]

    return x.includes(request_type_id)
}