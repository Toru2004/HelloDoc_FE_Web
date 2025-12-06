import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  where,
} from "firebase/firestore";

import type { WhereFilterOp } from "firebase/firestore";

// Định nghĩa kiểu trả về của hàm phân trang
type PaginateResult<T> = {
  data: T[];
  lastDoc: any;
  hasNext: boolean;
};

// Kiểu filter (nếu có)
type FirestoreFilter = {
  field: string;
  operator: WhereFilterOp; // 👈 sửa lại ở đây
  value: any;
};

export async function paginateFirestore<T>({
  collectionPath,
  orderByField,
  limitCount,
  lastVisible,
  firestoreInstance,
  filters = [],
}: {
  collectionPath: string;
  orderByField: string;
  limitCount: number;
  lastVisible?: any;
  firestoreInstance: any;
  filters?: FirestoreFilter[];
}): Promise<PaginateResult<T>> {
  const colRef = collection(firestoreInstance, collectionPath);

  const constraints: any[] = [];

  // Nếu có filters thì thêm where vào query
  filters.forEach((f) => {
    constraints.push(where(f.field, f.operator, f.value));
  });

  constraints.push(orderBy(orderByField, "desc"));

  if (lastVisible) {
    constraints.push(startAfter(lastVisible));
  }

  constraints.push(limit(limitCount));

  const q = query(colRef, ...constraints);

  const snapshot = await getDocs(q);

  const docs = snapshot.docs.map((doc) => doc.data() as T);

  return {
    data: docs,
    lastDoc: snapshot.docs[snapshot.docs.length - 1],
    hasNext: snapshot.size === limitCount,
  };
}
