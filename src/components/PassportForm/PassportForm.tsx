"use client";

import { TextInput } from "../TextInput/TextInput";
import Image from "next/image";
import { Button } from "../ui/button";
import { DialogClose } from "../ui/dialog";
import { type FC } from "react";
import { AvatarUpload } from "../AvatarUpload/AvatarUpload";
import { type PassportFormSchema, passportFormSchema } from "~/types/passport";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import type { ImageType } from "react-images-uploading";

interface PassportFormProps {
  onSubmit: (data: PassportFormSchema) => Promise<void>;
  setAvatar: (avatar: ImageType | null) => void;
  setName: (name: string) => void;
  setIntro: (intro: string) => void;
  defaultValues?: Partial<PassportFormSchema>;
}

export const PassportForm: FC<PassportFormProps> = ({ 
  onSubmit,
  defaultValues,
  setAvatar,
  setName,
  setIntro
}) => {
  const methods = useForm<PassportFormSchema>({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    resolver: zodResolver(passportFormSchema),
    defaultValues: {
      name: "",
      avatar: "",
      avatarFile: undefined,
      introduction: "",
      x: "",
      github: "",
      ...defaultValues
    },
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}
        className="flex h-full w-full items-center justify-start bg-black/30 backdrop-blur-3xl"
      >
        <div className="mx-4 flex flex-col sm:ml-[100px] sm:h-[600px]">
          <h1 className="font-everett text-[24px] leading-[24px] text-white sm:text-[32px] sm:leading-[38px]">
            Let&apos;s get you a passport
          </h1>
          <div className="mt-8 sm:mt-12">
            <AvatarUpload onAvatarChange={(avatar) => setAvatar(avatar)} />
          </div>
          <div className="mt-4 flex w-[358px] flex-col gap-4 sm:w-[520px]">
            <TextInput
              labelText="Your Name*"
              placeholder="John Smith"
              className="h-[66px] sm:h-[79px]"
              {...methods.register("name")}
              onChange={(e) => setName(e.target.value)}
            />
            <TextInput
              labelText="Introduction"
              placeholder="23 y.o. designer from San Francisco"
              className="h-[66px] sm:h-[79px]"
              {...methods.register("introduction")}
              onChange={(e) => setIntro(e.target.value)}
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-between">
                <Image
                  src={"/images/x.png"}
                  alt="x-logo"
                  width={20}
                  height={20}
                  className="h-[20px] w-[20px]"
                />
                <p className="ml-4 text-nowrap font-inter text-[14px] text-white">
                  X Profile
                </p>
              </div>
              <TextInput
                placeholder="@jack_on_twitter"
                className="h-[43px] w-[242px] text-white sm:h-[56px] sm:w-[384px]"
                {...methods.register("x")}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-between">
                <Image
                  src={"/images/github.png"}
                  alt="github-logo"
                  width={20}
                  height={20}
                />
                <p className="ml-4 font-inter text-white">Github</p>
              </div>
              <TextInput
                placeholder="@jack_on_github"
                className="h-[43px] w-[242px] sm:h-[56px] sm:w-[384px]"
                {...methods.register("github")}
              />
            </div>
          </div>
          <div className="mb-[25px] mt-[48px] flex justify-end gap-4">
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                className="h-[42px] w-[97px] sm:h-[52px] sm:w-[110px]"
              >
                <Image
                  src={"/images/arrow-undo.png"}
                  alt="arrow"
                  width={16}
                  height={16}
                  className="h-[12px] w-[12px]"
                />
                Back
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="h-[42px] w-[202px] sm:h-[52px] sm:w-[212px]"
            >
              <Image
                src={"/images/passport.png"}
                alt="passport"
                width={16}
                height={16}
              />
              Get Your Passport
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};
