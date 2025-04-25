"use client";

import { ReactNode } from "react";
import { ToonProvider } from "@/app/context/ToonContext";
import { ConnectionProvider } from "@/app/context/ConnectionContext";
import { DiscordProvider } from "@/app/context/DiscordContext";
import { ActivePortsProvider } from "../context/ActivePortsContext";
import { InvasionProvider } from "@/app/context/InvasionContext";
import { ToastProvider } from "@/app/context/ToastContext";
import InvasionNotificationHandler from "./Home/tabs/components/InvasionNotificationHandler";

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
                {children}
                <InvasionNotificationHandler />
              </InvasionProvider>
            </ActivePortsProvider>
          </ConnectionProvider>
        </DiscordProvider>
      </ToonProvider>
    </ToastProvider>
  );
};

export default Providers;
