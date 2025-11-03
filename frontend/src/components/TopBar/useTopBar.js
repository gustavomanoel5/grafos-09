import { useState, useEffect, useCallback } from "react";

export function useTopBar() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [user, setUser] = useState(null);

  const fetchNotifications = useCallback(async () => {
    try {
      // Simulated API call - replace with actual API
      const mockNotifications = [
        { id: 1, title: "Nova ata disponível", read: false },
        { id: 2, title: "Contrato atualizado", read: false },
      ];
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter((n) => !n.read).length);
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
    }
  }, []);

  const fetchUserData = useCallback(async () => {
    try {
      // Simulated API call - replace with actual API
      const mockUser = {
        name: "Usuário",
        //avatar: 'https://via.placeholder.com/40',
      };
      setUser(mockUser);
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
    }
  }, []);

  const markNotificationAsRead = useCallback((notificationId) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  useEffect(() => {
    fetchNotifications();
    fetchUserData();
  }, [fetchNotifications, fetchUserData]);

  return {
    notifications,
    unreadCount,
    user,
    markNotificationAsRead,
    markAllAsRead,
    refetchNotifications: fetchNotifications,
  };
}
