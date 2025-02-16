"use client";

import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { Button } from "../ui/button";
import { LeftPanelWithPassportCard } from "./ui/LeftPanelWithPassportCard";
import { PassportForm } from "../PassportForm/PassportForm";
import { useState } from "react";
import { type ImageType } from "react-images-uploading";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

export const PassportCreationModal = () => {
  const [name, setName] = useState<string | undefined>();
  const [intro, setIntro] = useState<string | undefined>();
  const [avatar, setAvatar] = useState<ImageType | null>(null);

  return (
    <>
      <div className="z-10 mt-12 flex w-[342px] flex-col justify-center gap-1 rounded-3xl bg-gradient-to-r from-[#213244] from-20% via-[#13273d] to-[#17293c] px-6 py-5 text-[#ABBDCC] sm:mt-[80px] sm:w-[720px]">
        <Label
          htmlFor="id"
          className="font-inter text-[16px] font-light leading-[25px] sm:text-[20px]"
        >
          Claim your name for Sui Passport
        </Label>
        <Input
          className="h-[38px] font-everett text-[32px] text-white sm:h-[58px] sm:text-[48px]"
          type="text"
          id="id"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="z-10 mt-12 h-[42px] w-[162px] sm:h-[52px] sm:w-[188px]">
            Get Your Passport
          </Button>
        </DialogTrigger>
        <DialogContent>
          <div className="flex h-screen flex-col items-center overflow-y-scroll sm:flex-row">
            <LeftPanelWithPassportCard
              avatar={avatar}
              name={name ?? ""}
              intro={intro ?? ""}
            />
            <PassportForm
              onIntroChange={setIntro}
              onNameChange={setName}
              onAvatarChange={setAvatar}
              name={name}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
