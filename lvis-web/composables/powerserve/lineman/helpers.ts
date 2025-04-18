import type { Remarks } from "../common";


export const get_numerical_rating = (payload: {
    standard_qty: number,
    accomplishment_qty: number
}): number => {
    const { standard_qty, accomplishment_qty } = payload;
    
    if (standard_qty === 0) {
        return 0; // or handle division by zero as appropriate for your use case
    }
    
    const rating = (accomplishment_qty / standard_qty) * 100;
    return parseFloat(rating.toFixed(2));
};

export const get_remarks = (payload: {
    numerical_rating: number,
    remarks: Remarks[]
}): Remarks | undefined => {
    const { numerical_rating, remarks } = payload;
    
    const remark = remarks.find(i => numerical_rating >= i.min && numerical_rating <= i.max)

    if(remark) {
        return remark
    }

    return undefined

};