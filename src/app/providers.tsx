/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
'use client'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { networkConfig, network } from "~/lib/contracts"
import "@mysten/dapp-kit/dist/index.css";
import { UserProfileProvider } from "~/context/user-profile-context";
import { PassportsStampsProvider } from "~/context/passports-stamps-context";
import { registerStashedWallet } from '@mysten/zksend';
import { useEffect } from "react";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        if (typeof window !== 'undefined') {
            registerStashedWallet('Sui Passport', {
                network: network,
            });
        }
    }, []);
    return (
        <QueryClientProvider client={queryClient}>
            <SuiClientProvider networks={networkConfig} defaultNetwork={network}>
                <PassportsStampsProvider>
                    <UserProfileProvider>
                        <WalletProvider>
                            {children}
                        </WalletProvider>
                    </UserProfileProvider>
                </PassportsStampsProvider>
            </SuiClientProvider>
        </QueryClientProvider>
    );
}
