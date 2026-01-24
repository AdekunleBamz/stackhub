"use client";

import { showConnect, AppConfig, UserSession } from "@stacks/connect";
import { useAppKit, useAppKitAccount, useDisconnect } from "@reown/appkit/react";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const appConfig = new AppConfig(["store_write", "publish_data"]);
const userSessionInstance = new UserSession({ appConfig });

interface WalletContextType {
  // Stacks wallet
  stacksConnected: boolean;
  stacksAddress: string | null;
  connectStacks: () => void;
  disconnectStacks: () => void;
  
  // EVM wallet (via Reown)
  evmConnected: boolean;
  evmAddress: string | undefined;
  connectEvm: () => void;
  disconnectEvm: () => void;
  
  // Combined
  isAnyConnected: boolean;
  
  // Legacy compatibility
  connected: boolean;
  address: string | null;
  connect: () => void;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType>({
  stacksConnected: false,
  stacksAddress: null,
  connectStacks: () => {},
  disconnectStacks: () => {},
  evmConnected: false,
  evmAddress: undefined,
  connectEvm: () => {},
  disconnectEvm: () => {},
  isAnyConnected: false,
  connected: false,
  address: null,
  connect: () => {},
  disconnect: () => {},
});

export function WalletProvider({ children }: { children: ReactNode }) {
  const [stacksAddress, setStacksAddress] = useState<string | null>(null);
  
  // Reown AppKit hooks
  const { open } = useAppKit();
  const { address: evmAddress, isConnected: evmConnected } = useAppKitAccount();
  const { disconnect: disconnectWagmi } = useDisconnect();

  useEffect(() => {
    // Check session asynchronously to avoid synchronous state update warning
    const checkSession = async () => {
      if (userSessionInstance.isUserSignedIn()) {
        const userData = userSessionInstance.loadUserData();
        setStacksAddress(userData.profile.stxAddress.mainnet);
      }
    };
    checkSession();
  }, []);

  const connectStacks = () => {
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

  const disconnectStacks = () => {
    userSessionInstance.signUserOut();
    setStacksAddress(null);
    window.location.reload();
  };

  const connectEvm = () => {
    open();
  };

  const disconnectEvm = () => {
    disconnectWagmi();
  };

  return (
    <WalletContext.Provider
      value={{
        stacksConnected: !!stacksAddress,
        stacksAddress,
        connectStacks,
        disconnectStacks,
        evmConnected,
        evmAddress,
        connectEvm,
        disconnectEvm,
        isAnyConnected: !!stacksAddress || evmConnected,
        // Legacy compatibility
        connected: !!stacksAddress,
        address: stacksAddress,
        connect: connectStacks,
        disconnect: disconnectStacks,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);

