import { CanvassData, CanvassItems } from "./canvass.types";



export const canvass_items: CanvassItems[] = [
    {
        description: 'Office Chair',
        unit: 'pcs',
        quantity: 5
    },
    {
        description: 'Mouse',
        unit: 'pcs',
        quantity: 15
    }
]


export const canvass_data: CanvassData = {
    requisitioner: 'tayag',
    purpose: 'test purpose in canvass',
    notes: 'test notes in canvass',
    items: canvass_items
}