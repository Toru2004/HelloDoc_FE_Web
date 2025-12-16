import { io, type Socket } from 'socket.io-client';

interface OnlineStatsPayload {
  users: number;
  doctors: number;
  userIds?: string[];
  doctorIds?: string[];
}

export const useWebSocket = () => {
  const config = useRuntimeConfig();
  const apiBaseUrl = config.public.apiBaseUrl as string;
  const auth = useAuth();

  // ===== Shared state =====
  const socket = useState<Socket | null>('socket', () => null);
  const isConnected = useState<boolean>('socket_connected', () => false);

  const onlineUsers = useState<number>('online_users', () => 0);
  const onlineDoctors = useState<number>('online_doctors', () => 0);

  // OPTIONAL: nếu cần list
  const onlineUserIds = useState<string[]>('online_user_ids', () => []);
  const onlineDoctorIds = useState<string[]>('online_doctor_ids', () => []);

  const connect = () => {
    if (socket.value?.connected) {
      console.warn('WebSocket already connected');
      return;
    }

    const token = auth.getToken();
    if (!token) {
      console.warn('Cannot connect to WebSocket: No token found');
      return;
    }

    socket.value = io(apiBaseUrl, {
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
      query: {
        token,
      },
      transports: ['websocket'],
      autoConnect: true,
    });

    // ===== EVENTS =====
    socket.value.on('connect', () => {
      console.log('✅ WebSocket connected');
      isConnected.value = true;
    });

    socket.value.on('disconnect', () => {
      console.log('🔌 WebSocket disconnected');
      isConnected.value = false;
    });

    socket.value.on('online_stats', (data: OnlineStatsPayload) => {
      console.log('📊 Received online stats:', data);

      onlineUsers.value = data.users;
      onlineDoctors.value = data.doctors;

      // nếu backend có gửi list
      if (data.userIds) {
        onlineUserIds.value = data.userIds;
      }

      if (data.doctorIds) {
        onlineDoctorIds.value = data.doctorIds;
      }
    });

    socket.value.on('connect_error', (err) => {
      console.error('❌ WebSocket connection error:', err.message);
    });
  };

  const disconnect = () => {
    if (!socket.value) return;

    socket.value.removeAllListeners();
    socket.value.disconnect();
    socket.value = null;
    isConnected.value = false;
  };

  return {
    // state
    isConnected,
    onlineUsers,
    onlineDoctors,
    onlineUserIds,
    onlineDoctorIds,

    // actions
    connect,
    disconnect,
  };
};
