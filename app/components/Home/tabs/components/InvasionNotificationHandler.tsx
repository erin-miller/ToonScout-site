"use client";
import { useInvasionNotifications } from "./useInvasionNotifications";

const InvasionNotificationHandler = () => {
  const { toast } = useInvasionNotifications();
  return toast;
};

export default InvasionNotificationHandler;
