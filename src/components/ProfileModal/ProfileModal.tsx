"use client";

import { motion } from "motion/react";
import { Button } from "../ui/button";
import Image from "next/image";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "../ui/dialog";
import { StickersLayout } from "./ui/StickersLayout";

export const ProfileModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-[52px] w-[189px]">
          <Image
            src={"/images/wallet.png"}
            alt="wallet"
            width={16}
            height={16}
          />
          Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent>
        <motion.div
          initial={{ y: 200, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 200, opacity: 0 }}
          transition={{ type: "spring" }}
          className="flex h-screen w-full flex-col items-center backdrop-blur-[8px]"
        >
          <StickersLayout />
          <Image
            src={"/images/profile-avatar-default.png"}
            alt="avatar"
            width={150}
            height={150}
            unoptimized
          />
          <div className="mb-6 mt-[48px] flex flex-col items-center gap-4">
            <div className="flex flex-col items-center gap-2">
              <p className="font-inter text-[20px] leading-6 text-white">
                Artem G
              </p>
              <p className="max-w-[405px] text-center font-inter text-[16px] leading-6 text-[#ABBDCC]">
                23 y.o. designer from San Francisco, there’s a bit more to show
                2 lines of description
              </p>
            </div>
            <span className="flex gap-2">
              <Image
                src={"/images/drop.png"}
                alt="drop-icon"
                width={14}
                height={14}
                className="object-contain"
              />
              <p className="font-inter text-white">{2450}</p>
            </span>
            <p className="flex cursor-pointer gap-2 font-inter text-[16px] leading-5 text-[#4DA2FF]">
              Details on Sui Vision
              <Image
                src={"/images/arrow-up-right.png"}
                width={16}
                height={16}
                alt="arrow"
                className="object-contain"
              />
            </p>
            <DialogClose asChild>
              <Button variant="secondary" className="mt-12 h-[52px] w-[116px]">
                Close
                <Image
                  src={"/images/cross.png"}
                  alt="cross"
                  width={16}
                  height={16}
                />
              </Button>
            </DialogClose>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
