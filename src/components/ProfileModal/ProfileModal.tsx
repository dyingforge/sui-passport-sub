/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
"use client";

import { motion } from "motion/react";
import { Button } from "../ui/button";
import Image from "next/image";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "../ui/dialog";
import { StickersLayout } from "./ui/StickersLayout";
import { useCallback, useEffect, useState } from "react";
import { useNetworkVariables } from "~/lib/contracts";
import { useUserProfile } from "~/context/user-profile-context";
import { removeToken } from "~/lib/jwtManager";
import { ConnectModal, useAccounts, useCurrentAccount, useCurrentWallet, useDisconnectWallet } from '@mysten/dapp-kit'

export const ProfileModal = () => {
  const { refreshProfile, userProfile } = useUserProfile()
  const networkVariables = useNetworkVariables()
  const { mutate: disconnect } = useDisconnectWallet()
  const accounts = useAccounts()
  const currentAccount = useCurrentAccount()
  const { connectionStatus } = useCurrentWallet()
  const [open, setOpen] = useState(false)
  const { clearProfile } = useUserProfile()
  const [isMobileApp, setIsMobileApp] = useState(false);
  const [isInSuiWallet, setIsInSuiWallet] = useState(false);

  const onConnected = useCallback(async () => {
    if (currentAccount?.address && connectionStatus === "connected") {
      const address = currentAccount.address
      await refreshProfile(address, networkVariables)
    }
    if (connectionStatus === "disconnected") {
      await removeToken()
    }
  }, [currentAccount?.address, connectionStatus, networkVariables, refreshProfile])

  const handleDisconnect = useCallback(() => {
    void disconnect()
    setOpen(false)
    clearProfile()
  }, [disconnect, setOpen, clearProfile])

  useEffect(() => {
    void onConnected()
  }, [onConnected])

  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isSuiWallet = /Sui-Wallet/i.test(navigator.userAgent);    
    setIsInSuiWallet(isSuiWallet);
    setIsMobileApp(isMobile && !isSuiWallet);
  }, []);

  if (!accounts.length) {
    if (isMobileApp && !isInSuiWallet) {
      return (
        <Button
          className="h-[34px] w-[150px] leading-4 sm:h-[52px] sm:w-[189px]"
          onClick={() => {
            window.location.href = 'suiwallet://';
            setTimeout(() => {
              window.location.href = 'https://apps.apple.com/us/app/sui-wallet-mobile/id6476572140';
            }, 2000);
          }}
        >
          <Image src={"/images/wallet.png"} alt="wallet" width={16} height={16} />
          Open with Sui Wallet
        </Button>
      );
    }

    return (
      <ConnectModal
        open={open}
        onOpenChange={setOpen}
        trigger={
          <Button
            className="h-[34px] w-[150px] leading-4 sm:h-[52px] sm:w-[189px]"
          >
            <Image src={"/images/wallet.png"} alt="wallet" width={16} height={16} />
            Connect Wallet
          </Button>
        }
      />
    );
  }

  return connectionStatus === "connected" && (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="h-[34px] w-[140px] leading-4 sm:h-[52px] sm:w-[168px]"
        >
          <Image src={"/images/user.png"} alt="user" className="w-4 h-4" width={16} height={16} />
          <p className="text-white truncate">{currentAccount?.address}</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-y-scroll" >
        <DialogTitle className="sr-only">
          {userProfile?.name}
        </DialogTitle>
        <motion.div
          initial={{ y: 200, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 200, opacity: 0 }}
          transition={{ type: "spring" }}
          className="flex w-full flex-col items-center backdrop-blur-[8px] sm:h-screen"
        >
          <StickersLayout stamps={userProfile?.stamps ?? []} />
          <Image
            src={userProfile?.avatar || "/images/profile-avatar-default.png"}
            alt="avatar"
            width={150}
            height={150}
            className="mt-[36px] h-[100px] w-[100px] sm:mt-0 sm:h-[150px] sm:w-[150px]"
            unoptimized
          />
          <div className="mb-6 mt-[32px] flex flex-col items-center gap-4 sm:mt-[48px]">
            <div className="flex flex-col items-center gap-2">
              <p className="font-inter text-[16px] leading-[20px] text-white sm:text-[20px] sm:leading-6">
                {userProfile?.name}
              </p>
              <p className="max-w-[358px] text-center font-inter text-[14px] leading-[18px] text-[#ABBDCC] sm:max-w-[405px] sm:text-[16px] sm:leading-6">
                {userProfile?.introduction}
              </p>
            </div>
            <span className="flex gap-2">
              <p className="font-inter text-[14px] text-white">{userProfile?.points} points</p>
            </span>
            <a
              className="flex cursor-pointer gap-2 font-inter text-[14px] leading-5 text-[#4DA2FF] sm:text-[16px]"
              href={`https://mainnet.suivision.xyz/object/${userProfile?.id?.id}`}
              target="_blank"
            >
              Details on Sui Vision
              <Image
                src={"/images/arrow-up-right.png"}
                width={16}
                height={16}
                alt="arrow"
                className="object-contain"
              />
            </a>
            <div className="flex gap-2">
              <DialogClose asChild>
                <Button
                  variant="secondary"
                  className="mt-6 h-[42px] w-[102px] sm:mt-12 sm:h-[52px] sm:w-[116px]"
                >
                  Close
                  <Image
                    src={"/images/cross.png"}
                    alt="cross"
                    width={16}
                    height={16}
                  />
                </Button>
              </DialogClose>
              <Button
                variant="secondary"
                className="mt-6 h-[42px] w-[102px] sm:mt-12 sm:h-[52px] sm:w-[116px]"
                onClick={handleDisconnect}
              >
                Disconnect
              </Button>
            </div>

          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
