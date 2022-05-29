import { DocumentReference, Timestamp } from 'firebase/firestore';
import IUser from './IUser';

export default interface IRating {
  comment: string;
  created_at: Timestamp;
  start: number;
  user: IUser;
}
