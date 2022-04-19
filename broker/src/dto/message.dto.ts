import { IsDateString, IsJSON, IsUUID } from "class-validator";

export class Message {
    @IsUUID()
    id!: string;

    @IsDateString()
    timestamp!: string;

    @IsJSON()
    payload!: any;
}