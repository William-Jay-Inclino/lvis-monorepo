import type { APPROVAL_STATUS, Approver, VAT_TYPE } from "~/composables/common.types";
import type { RV } from "../rv/rv.types";
import type { CanvassItem } from "../canvass/canvass-item.types";
import type { MeqsSupplier } from "./meqs-supplier";
import type { MeqsSupplierItem } from "./meqs-supplier-item";
import type { SPR } from "../spr/spr.types";
import type { JO } from "../jo/jo.types";
import type { Supplier } from "../../warehouse/supplier/supplier";
import type { Employee } from "~/composables/hr/employee/employee.types";
import type { CreateMeqsAttachment, MeqsAttachment } from "./meqs-attachment";


export interface MEQS {
  id: string;
  jo_id: string | null
  jo_number: string | null;
  spr_id: string | null
  spr_number: string | null;
  rv_id: string | null
  rv_number: string | null;
  meqs_number: string;
  meqs_date: string;
  meqs_notes: string | null;
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
  can_update?: boolean
  requested_by: Employee | null
  attachments: MeqsAttachment[];

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
  meqs_notes: string | null;
  approvers: MeqsApproverSettings[];
  meqs_suppliers: MeqsSupplier[];
  attachments: CreateMeqsAttachment[];
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
  meqs_notes: string | null
  attachments: CreateMeqsAttachment[];
}