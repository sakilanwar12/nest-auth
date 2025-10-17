export class IAuthUser {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}
export type ISafeAuthUser = Omit<IAuthUser, 'password'>;
