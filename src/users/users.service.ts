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
          data = { ...userFound, id: users.docs[0].id };
          desc = 'Successful';
        } else {
          status = 201;
          desc = 'Invalid password';
        }
      } else {
        status = 201;
        desc = 'email or password not valid';
      }
      return { status, data, desc };
    } catch (error) {
      console.log(error);
      return { status: 500, error };
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
        const hash = bcrypt.hashSync(user.password, 10);
        user.password = hash;
        user.created_at = Timestamp.now();
        const userRef2 = addDoc(userRef, user);
        delete user.password;
        user.id = (await userRef2).id;
      }
      return { status: 200, data: user };
    } catch (error) {
      return { status: 200, error };
    }
  }
}
