import IUser from 'src/interfaces/IUser';

export default class HostUser implements IUser {
  email: string;
  phone: string;
  password: string;
  id: string;
  hotel_id: string;
}
