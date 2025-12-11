'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import Pusher from 'pusher-js';
import { useSession } from 'next-auth/react';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  createdAt: string;
  isRead: boolean;
}

interface UseRealtimeNotificationsOptions {
  onNotification?: (notification: Notification) => void;
  showToast?: boolean;
  autoReconnect?: boolean;
}

/**
 * Hook for real-time notifications using Pusher
 */
export function useRealtimeNotifications(options: UseRealtimeNotificationsOptions = {}) {
  const { showToast = true, autoReconnect = true, onNotification } = options;
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const pusherRef = useRef<Pusher | null>(null);
  const channelRef = useRef<any>(null);

  // Initialize Pusher connection
  const connect = useCallback(() => {
    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'us2';

    if (!pusherKey || !session?.user?.id) {
      return;
    }

    // Create Pusher instance
    pusherRef.current = new Pusher(pusherKey, {
      cluster: pusherCluster,
      forceTLS: true,
    });

    // Subscribe to user's private channel
    const channelName = `private-user-${session.user.id}`;
    channelRef.current = pusherRef.current.subscribe(channelName);

    // Handle connection state
    pusherRef.current.connection.bind('connected', () => {
      setIsConnected(true);
      console.log('Pusher connected');
    });

    pusherRef.current.connection.bind('disconnected', () => {
      setIsConnected(false);
      console.log('Pusher disconnected');
    });

    pusherRef.current.connection.bind('error', (err: any) => {
      console.error('Pusher error:', err);
      setIsConnected(false);
    });

    // Handle notifications
    channelRef.current.bind('notification', (data: Notification) => {
      setNotifications((prev) => [data, ...prev]);
      setUnreadCount((prev) => prev + 1);

      // Invalidate notifications query
      queryClient.invalidateQueries({ queryKey: ['notifications'] });

      // Show toast notification
      if (showToast) {
        toast(data.title, {
          description: data.message,
          action: data.data?.actionUrl
            ? {
                label: 'عرض',
                onClick: () => window.location.href = data.data.actionUrl,
              }
            : undefined,
        });
      }

      // Call custom handler
      onNotification?.(data);
    });

    // Handle specific event types
    channelRef.current.bind('session.started', (data: any) => {
      toast.info('بدأت جلسة جديدة', {
        description: data.title,
      });
    });

    channelRef.current.bind('enrollment.completed', (data: any) => {
      toast.success('مبروك!', {
        description: `تم إكمال الدورة: ${data.courseName}`,
      });
    });

  }, [session?.user?.id, queryClient, showToast, onNotification]);

  // Disconnect from Pusher
  const disconnect = useCallback(() => {
    if (channelRef.current) {
      channelRef.current.unbind_all();
      channelRef.current.unsubscribe();
    }
    if (pusherRef.current) {
      pusherRef.current.disconnect();
    }
    setIsConnected(false);
  }, []);

  // Mark notification as read
  const markAsRead = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notificationId ? { ...n, isRead: true } : n
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  }, []);

  // Clear notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  // Connect on mount, disconnect on unmount
  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  // Auto-reconnect on disconnection
  useEffect(() => {
    if (!isConnected && autoReconnect && session?.user?.id) {
      const timeout = setTimeout(connect, 5000);
      return () => clearTimeout(timeout);
    }
  }, [isConnected, autoReconnect, connect, session?.user?.id]);

  return {
    isConnected,
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    connect,
    disconnect,
  };
}

/**
 * Simple hook for notification count badge
 */
export function useNotificationCount() {
  const { unreadCount } = useRealtimeNotifications({ showToast: false });
  return unreadCount;
}
