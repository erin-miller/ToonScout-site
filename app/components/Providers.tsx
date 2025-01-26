import { ReactNode } from "react";
import { ToonProvider } from "@/app/context/ToonContext";
import { ConnectionProvider } from "@/app/context/ConnectionContext";
import { DiscordProvider } from "@/app/context/DiscordContext";
import { ActivePortsProvider } from "../context/ActivePortsContext";

interface ProvidersProps {
  children: ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <ToonProvider>
      <DiscordProvider>
        <ConnectionProvider>
          <ActivePortsProvider>{children}</ActivePortsProvider>
        </ConnectionProvider>
      </DiscordProvider>
    </ToonProvider>
  );
};

export default Providers;
