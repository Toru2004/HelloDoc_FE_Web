import { collection, addDoc, type Firestore, getDocs, doc, updateDoc } from "firebase/firestore";
import type { FirebaseApp } from "firebase/app";
import { Timestamp, onSnapshot } from "firebase/firestore";

const { $firestore } = useNuxtApp();
const db = $firestore as Firestore;
export async function saveRequestFireBase(lines: string[], approve: boolean) {
  try {
    // Tạo object lưu trữ dữ liệu
    const data: Record<string, string | boolean> = { approve };

    // Duyệt từng dòng để tách key và value
    lines.forEach(line => {
      const [key, ...rest] = line.split(':');
      if (key && rest.length > 0) {
        data[key.trim()] = rest.join(':').trim();
      }
    });

    const docRef = await addDoc(collection(db, "lichsuyeucau"), data);

    console.log("Đã lưu dữ liệu với ID:", docRef.id);
  } catch (error) {
    console.log("Lỗi khi lưu dữ liệu lên Firestore:", error);
  }
}
export async function editStatus(RequestPort: boolean) {
  try {
    const statusColletion = collection(db, "Status");
    const querySnapshot = await getDocs(statusColletion);
    if (querySnapshot.empty) {
      console.log("khong co colletion trong status");
      return;
    }
    const docSnapshot = querySnapshot.docs[0];
    const docRef = doc(db, "Status", docSnapshot.id);
    // Lấy thời gian hiện tại
    const now = new Date();

    // Cộng thêm 24h
    const nextDay = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Chuyển thành Firestore Timestamp
    const firestoreTimestamp = Timestamp.fromDate(nextDay);
    await updateDoc(docRef, {
      RequestPort,
      AutoOpen: !RequestPort,
      timeport: firestoreTimestamp
    });
    console.log("Cập nhật thành công document ID:", docSnapshot.id);
  } catch (error) {
    console.error("Lỗi khi cập nhật document:", error);
  }
}
export async function getStatus() {
  try {
    const statusCollection = collection(db, "Status");
    const querySnapshot = await getDocs(statusCollection);

    if (querySnapshot.empty) {
      console.log("Không có document nào trong Status");
      return null;
    }

    const docSnapshot = querySnapshot.docs[0];
    const data = docSnapshot.data();

    // timeport hiện tại trong Firestore
    const timeport = data.timeport as Timestamp;

    // Convert về Date để so sánh
    const expiredDate = timeport.toDate();
    const now = new Date();

    // Nếu hết hạn (quá 24h)
    if (expiredDate <= now) {
      console.log("Đã hết hạn 24h, tự động set RequestPort = false");

      // Cập nhật Firestore cho đồng bộ
      const docRef = doc(db, "Status", docSnapshot.id);
      await updateDoc(docRef, { RequestPort: false, AutoOpen: true });

      // Trả về object đã sửa
      return {
        ...data,
        RequestPort: false,
        AutoOpen: true,
        timeport: expiredDate
      };
    }

    // Nếu chưa hết hạn → trả về bình thường
    return {
      ...data,
      timeport: expiredDate
    };

  } catch (error) {
    console.error("Lỗi khi lấy Status:", error);
    return null;
  }
}
export function listenStatus() {
  const statusCollection = collection(db, "Status");
  onSnapshot(statusCollection, async (snapshot) => {
    if (!snapshot.empty) {
      const status = await getStatus(); // check & auto update nếu hết hạn
      console.log("Trạng thái realtime:", status);
    }
  });
}