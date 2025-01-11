import type { GasSlip } from "../motorpool/gas-slip/gas-slip.types";
import type { TripTicket } from "../motorpool/trip-ticket/trip-ticket.types";
import type { Canvass } from "../purchase/canvass/canvass.types";
import type { JO } from "../purchase/jo/jo.types";
import type { MEQS } from "../purchase/meqs/meqs.types";
import type { PO } from "../purchase/po/po.types";
import type { RV } from "../purchase/rv/rv.types";
import type { SPR } from "../purchase/spr/spr.types";
import type { MCRT } from "../warehouse/mcrt/mcrt.types";
import type { MCT } from "../warehouse/mct/mct.types";
import type { MRV } from "../warehouse/mrv/mrv.types";
import type { MST } from "../warehouse/mst/mst.types";
import type { OSRIV } from "../warehouse/osriv/osriv.types";
import type { RR } from "../warehouse/rr/rr.types";
import type { SERIV } from "../warehouse/seriv/seriv.types";

export interface Pending {
    id: number
    approver_id: string 
    reference_number: string;
    reference_table: DB_ENTITY;
    description: string
    transaction_date: Date
    approver_notes: string | null

    // set programmatically
    canvass?: Canvass
    rv?: RV
    spr?: SPR
    jo?: JO
    meqs?: MEQS
    po?: PO
    rr?: RR
    osriv?: OSRIV
    seriv?: SERIV
    mrv?: MRV
    mct?: MCT
    mcrt?: MCRT
    mst?: MST
    tripTicket?: TripTicket
    gasSlip?: GasSlip
}


export interface ApproveOrDisapprovePayload {
    id: number,
    remarks: string,
    classification_id?: string | null,
    fund_source_id?: string | null,
}