import { Timestamp, DocumentReference } from 'firebase/firestore';
import IRating from 'src/interfaces/IRating';
import IUser from 'src/interfaces/IUser';

export default class Rating implements IRating {
  comment: string;
  created_at: Timestamp;
  start: number;
  user: IUser;
}
