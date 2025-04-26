"use client";

import { ReactNode } from "react";
import { ToonProvider } from "@/app/context/ToonContext";
import { ConnectionProvider } from "@/app/context/ConnectionContext";
import { DiscordProvider } from "@/app/context/DiscordContext";
import { ActivePortsProvider } from "../context/ActivePortsContext";
import {
  InvasionProvider,
  NotificationToastWrapper,
} from "@/app/context/InvasionContext";
import { ToastProvider } from "@/app/context/ToastContext";
import { useNotificationSettingsPoll } from "@/app/utils/invasionUtils";

interface ProvidersProps {
  children: ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <ToastProvider>
      <ToonProvider>
        <DiscordProvider>
          <ConnectionProvider>
            <ActivePortsProvider>
              <InvasionProvider>
                <NotificationToastWrapper
                  notifSettings={useNotificationSettingsPoll(500)}
                >
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
