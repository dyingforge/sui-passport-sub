"use client";

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Button } from "../ui/button";
import { LeftPanelWithPassportCard } from "./ui/LeftPanelWithPassportCard";
import { PassportForm } from "../PassportForm/PassportForm";
import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { type PassportFormSchema } from "~/types/passport";


export interface PassportCreationModalProps {
  onSubmit: (data: PassportFormSchema) => Promise<void>;
}

export const PassportCreationModal = ({ onSubmit }: PassportCreationModalProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<PassportFormSchema>>({
    name: "",
    introduction: "",
    avatar: "",
    avatarFile: undefined,
    x: "",
    github: "",
  });


  const handleSubmit = async (data: PassportFormSchema) => {
    await onSubmit(data);
    setOpen(false);
  }

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
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        />
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="z-10 mt-12 h-[42px] w-[162px] sm:h-[52px] sm:w-[188px]">
            Get Your Passport
          </Button>
        </DialogTrigger>
        <DialogContent overlayClassName="bg-[#02101C]/50">
          <DialogTitle className="font-everett text-[24px] leading-[24px] text-white sm:text-[32px] sm:leading-[38px]">
          </DialogTitle>
          <div className="flex h-screen flex-col items-center overflow-y-scroll sm:flex-row">
            <LeftPanelWithPassportCard
              avatar={formData.avatar ?? ""}
              name={formData.name ?? ""}
              intro={formData.introduction ?? ""}
            />
            <PassportForm
              onSubmit={handleSubmit}
              defaultValues={formData}  
              setAvatar={(avatar) => setFormData(prev => ({ ...prev, avatar: avatar?.dataURL }))}
              setName={(name) => setFormData(prev => ({ ...prev, name }))}
              setIntro={(intro) => setFormData(prev => ({ ...prev, introduction: intro }))}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
