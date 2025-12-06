import { getFirestore, doc, getDocs, getDoc, collection, Firestore } from "firebase/firestore";
import { ref } from "vue";

export function useVehicleData(db: Firestore) {
    const solanra = ref<number>(0);
    const solanvao = ref<number>(0);
    const timelines = ref<any[]>([]);
    const timelineLoading = ref(false);

    async function fetchVehicleDataByDate(biensoxe: string, date: string) {
        timelineLoading.value = true;

        const vehicleRef = doc(db, "lichsuhoatdong", date, "xe", biensoxe);
        const vehicleSnap = await getDoc(vehicleRef);

        if (!vehicleSnap.exists()) {
            solanra.value = 0;
            solanvao.value = 0;
            timelines.value = [];
            timelineLoading.value = false;
            return;
        }

        const data = vehicleSnap.data();
        solanra.value = data?.solanra || 0;
        solanvao.value = data?.solanvao || 0;

        const timelineSnapshot = await getDocs(collection(vehicleRef, "timeline"));
        timelines.value = timelineSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        timelineLoading.value = false;
    }

    return {
        solanra,
        solanvao,
        timelines,
        timelineLoading,
        fetchVehicleDataByDate,
    };
}

export function useMultiVehicleData(db: Firestore, vehicleType: string) {
    const solanra = ref<number>(0);
    const solanvao = ref<number>(0);
    const timelines = ref<any[]>([]);
    const timelineLoading = ref(false);

    async function fetchVehicleDataByDate(biensoxe: string, date: string) {
        timelineLoading.value = true;

        const vehicleRef = doc(db, "lichsuhoatdong", date, vehicleType, biensoxe);
        const vehicleSnap = await getDoc(vehicleRef);

        if (!vehicleSnap.exists()) {
            solanra.value = 0;
            solanvao.value = 0;
            timelines.value = [];
            timelineLoading.value = false;
            return;
        }

        const data = vehicleSnap.data();
        solanra.value = data?.solanra || 0;
        solanvao.value = data?.solanvao || 0;

        const timelineSnapshot = await getDocs(collection(vehicleRef, "timeline"));
        timelines.value = timelineSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        timelineLoading.value = false;
    }

    return {
        solanra,
        solanvao,
        timelines,
        timelineLoading,
        fetchVehicleDataByDate,
    };
}
