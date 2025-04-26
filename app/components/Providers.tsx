"use client";

import { ReactNode, useState, useEffect } from "react";
import { ToonProvider } from "@/app/context/ToonContext";
import { ConnectionProvider } from "@/app/context/ConnectionContext";
import { DiscordProvider } from "@/app/context/DiscordContext";
import { ActivePortsProvider } from "../context/ActivePortsContext";
import { InvasionProvider } from "@/app/context/InvasionContext";
import { ToastProvider } from "@/app/context/ToastContext";
import { useInvasionNotifications } from "./Home/tabs/components/useInvasionNotifications";

interface ProvidersProps {
  children: ReactNode;
}

const getNotificationSettings = () => ({
  notificationsEnabled:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("tasksTabNotifications") || "false")
      : false,
  toastEnabled:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("tasksTabToastEnabled") || "true")
      : true,
  soundEnabled:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("tasksTabSoundEnabled") || "true")
      : true,
  toastPersistent:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("tasksTabToastPersistent") || "false")
      : false,
  soundRepeat:
    typeof window !== "undefined"
      ? parseInt(localStorage.getItem("tasksTabSoundRepeat") || "1", 10)
      : 1,
  soundRepeatInterval:
    typeof window !== "undefined"
      ? parseInt(
          localStorage.getItem("tasksTabSoundRepeatInterval") || "10",
          10
        )
      : 10,
  nativeNotifEnabled:
    typeof window !== "undefined"
      ? JSON.parse(
          localStorage.getItem("tasksTabNativeNotifEnabled") || "false"
        )
      : false,
});

// Polling workaround for instant settings sync
function useNotificationSettingsPoll(intervalMs = 1000) {
  const [notifSettings, setNotifSettings] = useState(getNotificationSettings());
  useEffect(() => {
    let prev = JSON.stringify(notifSettings);
    const interval = setInterval(() => {
      const next = getNotificationSettings();
      const nextStr = JSON.stringify(next);
      if (nextStr !== prev) {
        setNotifSettings(next);
        prev = nextStr;
      }
    }, intervalMs);
    return () => clearInterval(interval);
  }, []);
  return notifSettings;
}

function NotificationToastWrapper({
  notifSettings,
  children,
}: {
  notifSettings: any;
  children: ReactNode;
}) {
  const { toast } = useInvasionNotifications(notifSettings);
  return (
    <>
      {children}
      {toast}
    </>
  );
}

const Providers = ({ children }: ProvidersProps) => {
  const notifSettings = useNotificationSettingsPoll(500); // poll every 0.5s for snappier updates
  return (
    <ToastProvider>
      <ToonProvider>
        <DiscordProvider>
          <ConnectionProvider>
            <ActivePortsProvider>
              <InvasionProvider>
                <NotificationToastWrapper notifSettings={notifSettings}>
                  {children}
                </NotificationToastWrapper>
              </InvasionProvider>
            </ActivePortsProvider>
          </ConnectionProvider>
        </DiscordProvider>
      </ToonProvider>
    </ToastProvider>
  );
};

export default Providers;
