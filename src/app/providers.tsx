'use client'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { networkConfig, network } from "~/lib/contracts"
import "@mysten/dapp-kit/dist/index.css";
import { UserProfileProvider } from "~/context/user-profile-context";
import { PassportsStampsProvider } from "~/context/passports-stamps-context";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
      <QueryClientProvider client={queryClient}>
        <SuiClientProvider networks={networkConfig} defaultNetwork={network}>
          <PassportsStampsProvider>
            <UserProfileProvider>
              <WalletProvider autoConnect stashedWallet={
                {
                  name: "Sui Passport",
                  network: network,
                }
              }>
              {children}
            </WalletProvider>
            </UserProfileProvider>
          </PassportsStampsProvider>
        </SuiClientProvider>
      </QueryClientProvider>
  );
}
