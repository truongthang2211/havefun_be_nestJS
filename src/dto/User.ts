import IUser from 'src/interfaces/IUser';

export default class User implements IUser {
  email: string;
  phone: string;
  password: string;
  id: string;
}
