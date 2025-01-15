import moment from "moment";
import type { TRIP_TICKET_STATUS } from "~/composables/motorpool/trip-ticket/trip-ticket.enums";
import axios from "axios";
import Swal from "sweetalert2";


export function getFullname(firstname: string, middlename: string | null, lastname: string) {
    if (middlename) {
        return lastname + ', ' + firstname + ' ' + convertMiddleNameToInitial(middlename)
    }
    return lastname + ', ' + firstname
}

export function getFullnameWithTitles(
    firstname: string,
    lastname: string,
    middlename?: string | null,
    namePrefix?: string | null,
    nameSuffix?: string | null
  ): string {
    const middleInitial = middlename ? `${middlename[0].toUpperCase()}.` : "";
  
    const formattedLastName = nameSuffix ? `${lastname},` : lastname;
  
    const fullName = [
      namePrefix,  
      firstname,    
      middleInitial, 
      formattedLastName,
      nameSuffix    
    ]
      .filter(Boolean) 
      .join(" "); 
  
    return fullName;
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

export function formatTimeTo12Hour(date: Date | string): string {
    // Convert to Date object if `date` is a string
    if (typeof date === 'string') {
        date = new Date(date);
    }

    console.log('date', date);

    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // The hour '0' should be '12'
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;

    return `${hours}:${minutesStr} ${ampm}`;
}

export function get_day_and_time(d: any) {

    if (!d) {
        return ""
    }

    let date = d;
    if (!isNaN(d)) {
        date = Number(d) < 10000000000 ? Number(d) * 1000 : Number(d);
    }

    return moment(d).format('h:mm A ddd');
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

export function isBlankStatus(itemStatus: APPROVAL_STATUS | TRIP_TICKET_STATUS, approverStatus: APPROVAL_STATUS) {

    if((itemStatus === APPROVAL_STATUS.DISAPPROVED || itemStatus === APPROVAL_STATUS.CANCELLED) && approverStatus === APPROVAL_STATUS.PENDING) {
        return true 
    }

    return false 

}

export async function logout(authUser: AuthUser, apiUrl: string) {

    console.log('logout', authUser);

    try {

        const user_id = authUser.user.id
        const access_token = authUser.access_token

        const response = await axios.post(
            apiUrl + '/auth/logout/', 
            { user_id }, 
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            }
        );

        console.log('Logged out successfully:', response.data);

    } catch (error) {
        console.error('Error during logout:', error);
    } finally {
        localStorage.removeItem(LOCAL_STORAGE_AUTH_USER_KEY);
    }
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

export function handleUserInactivity(handleLogOut: () => Promise<void>) {
    console.log('handleUserInactivity');
    
    let timerInterval: NodeJS.Timeout;

    Swal.fire({
        icon: 'warning',
        title: "No Activity Detected!",
        html: "Automatic logout in <b></b> seconds.",
        timer: 11000,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading();

            const timerElement = Swal.getPopup()?.querySelector("b");

            if (timerElement) {
                // Update the timer text every second
                timerInterval = setInterval(() => {
                    const timeLeft = Swal.getTimerLeft();
                    
                    // Ensure timeLeft is defined and convert to seconds
                    if (timeLeft !== undefined) {
                        timerElement.textContent = `${Math.ceil(timeLeft / 1000)}`;
                    }
                }, 1000); // Update every second
            }
        },
        willClose: () => {
            clearInterval(timerInterval); // Clear interval when modal closes
        },
    }).then(async (result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
            await handleLogOut(); // Log out the user after the timer expires
        }
    });
}

export function isEmptyString(text: string | null | undefined) {
    if(!text || text.trim() === '' || text === 'NULL') {
        return true 
    }
    return false
}