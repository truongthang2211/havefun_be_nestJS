import { Injectable } from '@nestjs/common';
import {
  addDoc,
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  query,
  Timestamp,
  where,
} from 'firebase/firestore';
import db from 'src/db/db';
import Hotel from 'src/dto/Hotel';
import Order from 'src/dto/Order';
import Room from 'src/dto/Room';
import ICreateOrder from 'src/interfaces/ICreateOrder';

@Injectable()
export class OrdersService {
  async CreateOrder(createOrder: ICreateOrder) {
    try {
      const hotelRef = doc(
        db,
        'hotels',
        createOrder.hotelID,
      ) as DocumentReference<Hotel>;
      console.log(createOrder);
      const roomRef = doc(
        db,
        'rooms',
        createOrder.roomID,
      ) as DocumentReference<Room>;
      const userRef = doc(db, 'users', createOrder.userID);
      const hotel = await getDoc<Hotel>(hotelRef);
      const room = await getDoc<Room>(roomRef);
      const user = await getDoc(userRef);

      if (!hotel.exists() || !room.exists() || !user.exists())
        return { status: 201, desc: 'Hote, room or user does not exist' };
      const order = new Order(room.data());
      order.order_end = createOrder.order_end;
      order.order_start = createOrder.order_start;
      order.hotel = hotel.data();
      const OrderCreate = {
        ...order,
        hotel: hotelRef,
        room: roomRef,
        userRef: userRef,
        discount_ratio: await order.getDiscount(),
        total_price_estimate: await order.total_price_real,
        created_at: Timestamp.now(),
      };
      const OrderAdded = await addDoc(collection(db, 'orders'), OrderCreate);
      return { status: 200, data: { ...OrderCreate, id: OrderAdded.id } };
    } catch (error) {
      console.log(error);
      return { status: 500, error };
    }
  }
  async GetOrderByHotel(HotelID: string) {
    try {
      const hotelRef = doc(db, 'hotels', HotelID);
      if (!(await getDoc(hotelRef)).exists())
        return { stautus: 201, desc: 'Hotel does not exist' };
      const orderCol = collection(db, 'orders') as CollectionReference<Order>;
      const q = query<Order>(orderCol, where('hotel', '==', hotelRef));
      const ListOrderSnap = await getDocs<Order>(q);
      const ListOrder = ListOrderSnap.docs.map((e) => {
        return { ...e.data(), id: e.id };
      });
      return { status: 200, data: ListOrder };
    } catch (error) {
      return { status: 500, error };
    }
  }
}
