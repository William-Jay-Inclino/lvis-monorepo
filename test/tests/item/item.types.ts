

export interface Item {
    description: string
    initial_qty: number
    initial_price: number
    unit: string
    item_type: ITEM_TYPE
    project: string | null
}

export const enum ITEM_TYPE {
    OS = 'Office Supply',
    SE = 'Special Equipment',
    LM = 'Line Material',
    SP = 'Spare Parts',
    HW = 'House Wiring',
}