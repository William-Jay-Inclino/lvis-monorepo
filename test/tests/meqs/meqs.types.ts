

export interface MeqsData {
    rv_number: string 
    suppliers: MeqsSupplier[]
}


export interface MeqsSupplier {
    supplier_name: string
    payment_terms: string 
    items: MeqsSupplierItem[]
}

export interface MeqsSupplierItem {
    price: number
    is_awarded: boolean
}
