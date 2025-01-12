import type { CanvassItem } from "../canvass/canvass-item.types";
import type { MeqsSupplier } from "./meqs-supplier";

export interface MeqsSupplierItem {
    id: string;
    meqs_supplier?: MeqsSupplier;
    canvass_item: CanvassItem;
    price: number;
    notes: string;
    is_awarded: boolean;
    vat_type: VAT_TYPE


    // set programmatically
    vat?: {
        value: VAT_TYPE,
        label: string
    }


    // these fields are used in forms
    invalidPrice?: boolean
}