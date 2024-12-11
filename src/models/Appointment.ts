export type ServiceType = "HAIRCUT" | "BEARD" | "HAIRCUT_AND_BEARD";
export interface Appointment {
    clientName: string;
    startTime: string;
    endTime: string;
    service?:ServiceType;
    style?:string;
}