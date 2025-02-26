/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
'use client'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { networkConfig, network } from "~/lib/contracts"
import "@mysten/dapp-kit/dist/index.css";
import { UserProfileProvider } from "~/context/user-profile-context";
import { PassportsStampsProvider } from "~/context/passports-stamps-context";
import { Toaster } from "~/components/ui/sonner";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <SuiClientProvider networks={networkConfig} defaultNetwork={network}>
                <PassportsStampsProvider>
                    <UserProfileProvider>
                        <WalletProvider autoConnect>
                            <Toaster position="top-right" />
                            {children}
                        </WalletProvider>
                    </UserProfileProvider>
                </PassportsStampsProvider>
            </SuiClientProvider>
        </QueryClientProvider>
    );
}
