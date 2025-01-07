import { ReactNode } from "react";
import { ToonProvider } from "@/app/context/ToonContext";
import { ConnectionProvider } from "@/app/context/ConnectionContext";
import { DiscordProvider } from "@/app/context/DiscordContext";

interface ProvidersProps {
  children: ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <ToonProvider>
      <DiscordProvider>
        <ConnectionProvider>{children}</ConnectionProvider>
      </DiscordProvider>
    </ToonProvider>
  );
};

export default Providers;
