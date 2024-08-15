import type { APPROVAL_STATUS, Approver, VAT_TYPE } from "~/composables/common.types";
import type { RV } from "../rv/rv.types";
import type { CanvassItem } from "../canvass/canvass-item.types";
import type { MeqsSupplier } from "./meqs-supplier";
import type { MeqsSupplierItem } from "./meqs-supplier-item";
import type { SPR } from "../spr/spr.types";
import type { JO } from "../jo/jo.types";
import type { Supplier } from "../supplier/supplier";
import type { Employee } from "~/composables/system/employee/employee.types";


export interface MEQS {
  id: string;
  jo_id: string | null
  rv_id: string | null
  spr_id: string | null
  meqs_number: string;
  meqs_date: string;
  notes: string;


  // =============== audit fields =============== 

  cancelled_by: string
  created_by: string
  updated_by: string
  cancelled_at: Date
  created_at: Date
  updated_at: Date


  // =============== derived / resolvers =============== 

  rv: RV | null;
  jo: JO | null;
  spr: SPR | null;
  meqs_approvers: Approver[];
  meqs_suppliers: MeqsSupplier[];
  status: APPROVAL_STATUS
  is_rr_completed?: boolean
  can_update?: boolean


  // =============== set programmatically =============== 
  hasAvailableSupplier?: boolean
}

export interface FindAllResponse {
  data: MEQS[]
  totalItems: number
  currentPage: number
  totalPages: number
}

export interface CreateMeqsInput {
  rv: RV | null;
  jo: JO | null;
  spr: SPR | null;
  notes: string;
  approvers: MeqsApproverSettings[];
  meqs_suppliers: MeqsSupplier[];
}

export interface CreateMeqsSupplierSubInput {
  supplier: Supplier | null;
  payment_terms: string;
  meqs_supplier_items: CreateMeqsSupplierItemSubInput[];
  attachments: any[];
}

export interface CreateMeqsSupplierItemSubInput {
  canvass_item: CanvassItem;
  price: number;
  notes: string;
  vat: {
    value: VAT_TYPE,
    label: string
  }
  is_awarded: boolean;

  // these fields are used in forms
  invalidPrice?: boolean
  meqsSupplier?: CreateMeqsSupplierSubInput
}

export interface CreateMeqsSupplierAttachmentSubInput {
  file: File;
}

export interface CanvassItemWithSuppliers {
  canvassItem: CanvassItem;
  lowestPriceItem: MeqsSupplierItem
  awardedItem: MeqsSupplierItem
}

export interface MeqsApproverSettings {
  approver_id: string,
  approver: Employee | null
  label: string
  order: number
}

export interface MutationResponse {
  success: boolean
  msg: string
  data?: MEQS
}

export interface UpdateMeqsInput {
  notes: string
}