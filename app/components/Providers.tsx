import { ReactNode } from "react";
import { ToonProvider } from "../context/ToonContext";
import { ConnectionProvider } from "../context/ConnectionContext";
import { DiscordProvider } from "../context/DiscordContext";

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
