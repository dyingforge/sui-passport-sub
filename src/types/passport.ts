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
    x: z.string()
        // X handle validation: allows alphanumeric characters, underscores, and dashes, with a maximum length of 15 characters
        .regex(/^@?(\w){1,15}$/, "Invalid X handle format")
        .max(15, "X handle must be less than 15 characters")
        .optional()
        .or(z.literal('')),
    github: z.string()
        // GitHub username validation: allows alphanumeric characters, dashes, and underscores, with a maximum length of 39 characters
        .regex(/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i, "Invalid GitHub username format")
        .max(39, "GitHub username must be less than 39 characters")
        .optional()
        .or(z.literal('')),
});

export type PassportFormSchema = z.infer<typeof passportFormSchema>;