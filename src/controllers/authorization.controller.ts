import { Request, Response } from "express";
import { ILoginDto, IRegistrationDto } from "../interfaces/registration-dto.interface";
import * as service from '../services/authorization.service';

export const register = async (req: Request<any, any, IRegistrationDto>, res: Response, next: any) => {
    try {
        const data = await service.register(req.body);

        if (data) {
            const result = res.status(data.status);
            data.user ? result.json(data.user) : result.send(data.message);
        }

    } catch (err) {
        next(err)
    }
}

export const login = async (req: Request<any, any, ILoginDto>, res: Response, next: any) => {
    try {
        const data = await service.login(req.body);

        if (data) {
            const result = res.status(data.status);
            data.user ? result.json(data.user) : result.send(data.message);
        }

    } catch (err) {
        next(err)
    }
}
