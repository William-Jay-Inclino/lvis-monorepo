export interface MeqsAttachment {
    id: string;
    meqs_id: string;
    src: string;
    filename: string;
}


export interface CreateMeqsAttachment {
    src: string;
    filename: string;
}