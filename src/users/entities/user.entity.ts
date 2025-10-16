export class IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}
export type ISafeUser = Omit<IUser, 'password'>;
