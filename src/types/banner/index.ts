import { BannerType } from "@/enums/banner/banner.enum";

export interface Banner {
    id: number;
    title: string;
    subtitle?: string;
    description?: string;
    image_url: string;
    button_text?: string;
    button_link?: string;
    status: BannerType;
    display_order: number;
    created_at: Date;
    updated_at?: Date;
}

export interface CreateBannerDto {
    title: string;
    subtitle?: string;
    description?: string;
    image_url: string;
    button_text?: string;
    button_link?: string;
    status: BannerType;
    display_order?: number;
}

export interface UpdateBannerDto {
    title?: string;
    subtitle?: string;
    description?: string;
    image_url?: string;
    button_text?: string;
    button_link?: string;
    status?: BannerType;
    display_order?: number;
}