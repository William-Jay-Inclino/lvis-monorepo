import type { MeqsSupplier } from "./meqs-supplier"
import type { MeqsSupplierItem } from "./meqs-supplier-item"



export function getSupplierItemsByCanvassId(canvassId: string, suppliers: MeqsSupplier[]): MeqsSupplierItem[] {

    const itemsByCanvassId: MeqsSupplierItem[] = []

    for (let supplier of suppliers) {

        const canvassItem = supplier.meqs_supplier_items.find(i => i.canvass_item.id === canvassId)
        if (canvassItem) {
            canvassItem.meqs_supplier = supplier
            itemsByCanvassId.push(canvassItem)
        }

    }

    return itemsByCanvassId

}

export function getLowestPriceItem(items: MeqsSupplierItem[]): MeqsSupplierItem {

    const getInitialItemIndx = items.findIndex(i => i.price !== -1)

    const lowestPriceItem = items.reduce((lowest, item) => {
        return (item.price < lowest.price && item.price !== -1) ? item : lowest;
    }, items[getInitialItemIndx]);

    return lowestPriceItem

}



export function hasRemarks(canvass_item_id: string, meqs_suppliers: MeqsSupplier[]): boolean {

    for (let supplier of meqs_suppliers) {

        const item = supplier.meqs_supplier_items.find(i => i.canvass_item.id === canvass_item_id)

        if (item) {
            const isNotEmpty = (!!item.notes || item.notes.trim() !== '')
            if(isNotEmpty){
                return true 
            }
        }

    }

    return false 
}