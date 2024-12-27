
export interface CanvassData {
    requisitioner: string
    purpose: string 
    notes: string
    items: CanvassItems[]
}

export interface CanvassItems {
    item_class?: 'stock' | 'non-stock'
    item?: string
    description?: string
    unit?: string
    quantity: number
}