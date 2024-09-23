import { IUser } from "@src/interface/user.interface";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      mediaDir?: string;
    }
  }
}


export { };
