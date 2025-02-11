"use client";

import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { Button } from "../ui/button";
import { LeftPanelWithPassportCard } from "./ui/LeftPanelWithPassportCard";
import { PassportForm } from "../PassportForm/PassportForm";
import { useState } from "react";

export const PassportCreationModal = () => {
  const [name, setName] = useState<string | undefined>();
  const [intro, setIntro] = useState<string | undefined>();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="z-10 mt-12 h-[52px] w-[188px]">
          Get Your Passport
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="flex h-screen items-center">
          <LeftPanelWithPassportCard name={name ?? ""} intro={intro ?? ""} />
          <PassportForm onIntroChange={setIntro} onNameChange={setName} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
