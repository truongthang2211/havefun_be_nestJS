import { Injectable } from '@nestjs/common';
import {
  collection,
  where,
  query,
  getDoc,
  getDocs,
  addDoc,
  Timestamp,
} from 'firebase/firestore';
import db from 'src/db/db';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  async UserSignIn(user) {
    let status = 200,
      data = null,
      desc = 'Invalid email';
    try {
      const userRef = collection(db, 'users');
      const q = query(userRef, where('email', '==', user.email));
      const users = await getDocs(q);
      const userFound = users.docs.length != 0 ? users.docs[0].data() : null;
      if (userFound) {
        const rs = await bcrypt.compareSync(user.password, userFound.password);
        if (rs) {
          delete userFound.password;
          data = userFound;
          desc = 'Successful';
        } else {
          status = 201;
          desc = 'Invalid password';
        }
      }
      return { status, data, desc };
    } catch (error) {
      console.log(error);
      return { status: 200, error };
    }
  }
  async UserSignUp(user) {
    try {
      const userRef = collection(db, 'users');
      const q = query(userRef, where('email', '==', user.email));
      const users = await getDocs(q);
      const userFound = users.docs.length != 0 ? users.docs[0].data() : null;
      if (userFound) {
        return { status: 201, data: 'Email existed' };
      } else {
        bcrypt.hash(user.password, 10, function (err, hash) {
          // Store hash in DB.
          user.password = hash;
          user.created_at = Timestamp.now();
          addDoc(userRef, user);
        });
      }
      return { status: 200, data: user };
    } catch (error) {
      return { status: 200, error };
    }
  }
}
