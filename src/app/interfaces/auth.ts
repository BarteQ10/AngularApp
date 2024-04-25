export interface User {
    id:string;
    fullName: string;
    email: string;
    password: string;
}

export interface Login {
    Mail: string;
    Password: string;
}

export interface Register {
    Mail: string | null | undefined;
    Password: string | null | undefined;
    FirstName: string | null | undefined;
    LastName: string | null | undefined;
    BirthDate: Date | null | undefined;
    Sex: boolean | null | undefined;
    DefaultAddress: string | null | undefined;
    DefaultPostalcode: string | null | undefined;
    DefaultLocation: string | null | undefined;
    Phone: string | null | undefined;
}