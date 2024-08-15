export interface MeqsSupplierAttachment {
    id: string;
    meqs_supplier_id: string;
    src: string;
    filename: string;
}


export interface CreateMeqsSupplierAttachmentInput {
    meqs_supplier_id: string;
    src: string;
    filename: string;
}


export interface MutationResponse {
    success: boolean
    msg: string
    data?: MeqsSupplierAttachment
}