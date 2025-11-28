export enum VoucherType {
    ACTIVE = 'active',
    INACTIVE = 'inactive'
}

export interface Voucher {
    id: number;
    code: string;
    discount_voucher: number;
    expiry_date: Date | string;
    status: VoucherType;
    min_order_value?: number;
    quantity: number;
}

export interface CreateVoucherDto {
    code: string;
    discount_voucher: number;
    expiry_date: Date | string;
    status?: VoucherType;
    min_order_value?: number;
    quantity: number;
}

export interface UpdateVoucherDto {
    code?: string;
    discount_voucher?: number;
    expiry_date?: Date | string;
    status?: VoucherType;
    min_order_value?: number;
    quantity?: number;
}
