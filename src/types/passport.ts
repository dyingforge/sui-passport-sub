import { z } from "zod";

export interface SuiPassport {
    id: string;
    name: string;
    avatar: string;
    introduction: string;
    exhibit: string[];
    collections: string[];
    points: number;
    x: string;
    github: string;
    email: string;
    last_time: number;
}

export interface PassportItem {
    id: string;
    sender: string;
    timestamp?: number;
}

export const passportFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(30, "Name must be less than 30 characters"),
    avatar: z.string().optional().or(z.literal('')),
    avatarFile: z.instanceof(File).optional(),
    introduction: z.string().max(100, "Introduction must be less than 100 characters").optional(),
});

export type PassportFormSchema = z.infer<typeof passportFormSchema>;