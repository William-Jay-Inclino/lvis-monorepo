import { Remarks } from "apps/powerserve/prisma/generated/client";
import { Remarks as RemarksEntity } from "../../remarks/entities/remarks";


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
}): RemarksEntity | undefined => {
    const { numerical_rating, remarks } = payload;
    
    // First try to find a matching remark in the normal range
    const remark = remarks.find(i => numerical_rating >= i.min && numerical_rating <= i.max);

    if (remark) {
        return remark as unknown as RemarksEntity;
    }
    
    // If no remark found, handle out-of-range cases
    if (remarks.length > 0) {
        if (numerical_rating > 120) {
            // Return last item if rating is above 120
            return remarks[remarks.length - 1] as unknown as RemarksEntity;
        } else if (numerical_rating < 0) {
            // Return first item if rating is below 0
            return remarks[0] as unknown as RemarksEntity;
        }
    }
    
    // Default return if no remarks exist or rating is between 0-120 but no match found
    return undefined;
};

// export const get_remarks = (payload: {
//     numerical_rating: number,
//     remarks: Remarks[]
// }): RemarksEntity | undefined => {
//     const { numerical_rating, remarks } = payload;
    
//     const remark = remarks.find(i => numerical_rating >= i.min && numerical_rating <= i.max)

//     if(remark) {
//         return remark as unknown as RemarksEntity
//     }

//     return undefined

// };