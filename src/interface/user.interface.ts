export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  roles: string[];
  comparePassword(password: string): Promise<boolean>;
  isDeleted: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}