import { Injectable } from '@nestjs/common';
import {
  addDoc,
  collection,
  CollectionReference,
  doc,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  getDoc,
  getDocs,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import db from 'src/db/db';
import Hotel from 'src/dto/Hotel';
import Order from 'src/dto/Order';
import Room from 'src/dto/Room';
import User from 'src/dto/User';
import ICreateOrder from 'src/interfaces/ICreateOrder';
import IOrder from 'src/interfaces/IOrder';

@Injectable()
export class OrdersService {
  async CreateOrder(createOrder: ICreateOrder) {
    try {
      const hotelRef = doc(
        db,
        'hotels',
        createOrder.hotelID,
      ) as DocumentReference<Hotel>;
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
      const order = new Order(room.data(), {
        ...hotel.data(),
        id: hotelRef.id,
      });
      order.order_end = createOrder.order_end;
      order.order_start = createOrder.order_start;
      order.order_status = 'processing';
      order.order_type = createOrder.order_type;
      await order.getDiscount();
      const OrderCreate = {
        ...order,
        hotel: hotelRef,
        room: roomRef,
        user: userRef,
        promotion: order.promotion,
        total_price_estimate: order.total_price_estimate,
        total_hour_spend_inorder: order.total_hour_spend_estimate,
        created_at: Timestamp.now(),
      };
      const OrderRespond = {
        ...OrderCreate,
        hotel: (({ id, name }) => ({ id, name }))(hotel.data()),
        room: (({ id, name, room_type, room_id }) => ({
          id,
          name,
          room_type,
          room_id,
        }))(room.data()),
        user: (({ id, email, phone }) => ({ id, email, phone }))(user.data()),
      };
      const OrderAdded = await addDoc(collection(db, 'orders'), OrderCreate);
      return { status: 200, data: { ...OrderRespond, id: OrderAdded.id } };
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
      const ListOrder = await Promise.all(
        ListOrderSnap.docs.map(async (e) => {
          const data: any = e.data();
          const hotelData = (await (await getDoc(data.hotel)).data()) as Hotel;
          const roomData = (await (await getDoc(data.room)).data()) as Room;
          const userData = (await (await getDoc(data.user)).data()) as User;
          const RespondObj = {
            ...data,
            hotel: (({ id, name }) => ({ id, name }))({
              ...hotelData,
              id: data.hotel.id,
            }),
            room: (({
              id,
              name,
              room_type,
              room_id,
              hour_price,
              hour_price_bonus,
              daily_price,
              overnight_price,
            }) => ({
              id,
              name,
              room_type,
              room_id,
              hour_price,
              hour_price_bonus,
              daily_price,
              overnight_price,
            }))({
              ...roomData,
              id: data.room.id,
            }),
            user: (({ id, email, phone }) => ({
              id,
              email,
              phone,
            }))({
              ...userData,
              id: data.user.id,
            }),
          };
          return { ...RespondObj, id: e.id };
        }),
      );
      return { status: 200, data: ListOrder };
    } catch (error) {
      return { status: 500, error };
    }
  }
  async GetOrderByUser(UserID: string) {
    try {
      const userRef = doc(db, 'users', UserID);
      if (!(await getDoc(userRef)).exists())
        return { stautus: 201, desc: 'User does not exist' };
      const orderCol = collection(db, 'orders') as CollectionReference<Order>;
      const q = query<Order>(orderCol, where('user', '==', userRef));
      const ListOrderSnap = await getDocs<Order>(q);
      const ListOrder = await Promise.all(
        ListOrderSnap.docs.map(async (e) => {
          const data: any = e.data();
          const hotelData = (await (await getDoc(data.hotel)).data()) as Hotel;
          const roomData = (await (await getDoc(data.room)).data()) as Room;
          const userData = (await (await getDoc(data.user)).data()) as User;
          const RespondObj = {
            ...data,
            hotel: (({ id, name }) => ({ id, name }))({
              ...hotelData,
              id: data.hotel.id,
            }),
            room: (({
              id,
              name,
              room_type,
              room_id,
              hour_price,
              hour_price_bonus,
              daily_price,
              overnight_price,
            }) => ({
              id,
              name,
              room_type,
              room_id,
              hour_price,
              hour_price_bonus,
              daily_price,
              overnight_price,
            }))({
              ...roomData,
              id: data.room.id,
            }),
            user: (({ id, email, phone }) => ({
              id,
              email,
              phone,
            }))({
              ...userData,
              id: data.user.id,
            }),
          };
          return { ...RespondObj, id: e.id };
        }),
      );
      return { status: 200, data: ListOrder };
    } catch (error) {
      return { status: 500, error };
    }
  }
  async EditOrder(orderRq: IOrder) {
    try {
      let OrderUpdate = {};
      const orderRef = await getDoc(doc(db, 'orders', orderRq.id));
      if (!orderRef.exists()) return { status: 201, desc: 'Order not found' };
      const order = orderRef.data();
      const hotel = (await (await getDoc(order.hotel)).data()) as Hotel;
      const room = (await (await getDoc(order.room)).data()) as Room;
      if (
        order.order_status !== 'complete' &&
        orderRq.order_status === 'complete'
      ) {
        const NewOrder = new Order(room, hotel);
        NewOrder.payment_time = Timestamp.now();
        NewOrder.order_start = order.order_start;
        NewOrder.order_end = order.order_end;
        console.log(NewOrder);
        OrderUpdate = {
          order_status: orderRq.order_status,
          payment_time: NewOrder.payment_time,
          total_hour_spend_real: NewOrder.total_hour_spend_real,
          total_price_real: NewOrder.total_price_real,
        };
      } else {
        OrderUpdate = {
          order_status: orderRq.order_status,
        };
      }
      await updateDoc(doc(db, 'orders', orderRq.id), OrderUpdate);
      return { status: 200, desc: 'Successful' };
    } catch (error) {
      console.log(error);
      return { status: 500, error };
    }
  }
}
