export interface IRegistrationDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface ILoginDto {
    email: string;
    password: string;
}
