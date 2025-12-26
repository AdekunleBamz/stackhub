"use client";

import { showConnect, AppConfig, UserSession } from "@stacks/connect";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const appConfig = new AppConfig(["store_write", "publish_data"]);
const userSessionInstance = new UserSession({ appConfig });

interface WalletContextType {
  connected: boolean;
  address: string | null;
  connect: () => void;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType>({
  connected: false,
  address: null,
  connect: () => {},
  disconnect: () => {},
});

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    if (userSessionInstance.isUserSignedIn()) {
      const userData = userSessionInstance.loadUserData();
      setAddress(userData.profile.stxAddress.mainnet);
    }
  }, []);

  const connect = () => {
    showConnect({
      appDetails: {
        name: "StackHub",
        icon: typeof window !== "undefined" ? window.location.origin + "/logo.png" : "/logo.png",
      },
      onFinish: () => {
        window.location.reload();
      },
      userSession: userSessionInstance,
    });
  };

  const disconnect = () => {
    userSessionInstance.signUserOut();
    setAddress(null);
    window.location.reload();
  };

  return (
    <WalletContext.Provider
      value={{
        connected: !!address,
        address,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);

