import { Request, Response } from "express";
import { ILoginDto, IRegistrationDto } from "../interfaces/registration-dto.interface";
import { AuthorizationService } from '../services/authorization/authorization-service.class';

export class AuthorizationController {

  private readonly service = new AuthorizationService();

  public async register(req: Request<any, any, IRegistrationDto>, res: Response, next: any): Promise<void> {
    try {
      const data = await this.service.register(req.body);

      if (data) {
        const result = res.status(data.status);
        data.response ? result.json(data.response) : result.send(data.message);
      }

    } catch (err) {
      next(err);
    }
  }

  public async login(req: Request<any, any, ILoginDto>, res: Response, next: any): Promise<void> {
    try {
      const data = await this.service.login(req.body);

      if (data) {
        const result = res.status(data.status);
        data.response ? result.json(data.response) : result.send( data.error );
      }

    } catch (err) {
      next(err);
    }
  }

  public async getUser(req: any, res: Response, next: any) {
    try {
      const data = await this.service.getUser(req.query);

      if (data) {
         data.response ? res.json(data.response) : res.status(data.status).send(data.message)
      }

    } catch (err) {
      next(err);
    }
  }

  public async getUsersByEmail(req: any, res: Response, next: any) {
    try {
      const data = await this.service.getUsersByEmail(req.query);

      if (data) {
       res.json({ users: data})
      }

    } catch (err) {
      next(err);
    }
  }
}
