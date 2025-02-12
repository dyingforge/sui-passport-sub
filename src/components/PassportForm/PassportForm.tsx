import { TextInput } from "../TextInput/TextInput";
import Image from "next/image";
import { Button } from "../ui/button";
import { DialogClose } from "../ui/dialog";
import { type FC } from "react";
import { AvatarUpload } from "../AvatarUpload/AvatarUpload";
import { type ImageType } from "react-images-uploading";

type PassportForm = {
  onNameChange: (name: string) => void;
  onIntroChange: (intro: string) => void;
  onAvatarChange: (avatar: ImageType | null) => void;
};

export const PassportForm: FC<PassportForm> = ({
  onNameChange,
  onIntroChange,
  onAvatarChange,
}) => {
  return (
    <div className="flex h-full w-full items-center justify-start backdrop-blur-3xl">
      <div className="ml-[100px] flex h-[600px] flex-col">
        <h1 className="font-everett text-[32px] leading-[38px] text-white">
          Let’s get you a passport
        </h1>
        <div className="mt-12">
          <AvatarUpload onImageUpload={onAvatarChange} />
        </div>
        <div className="mt-4 flex w-[520px] flex-col gap-4">
          <TextInput
            labelText="Your Name*"
            placeholder="John Smith"
            className="h-[79px]"
            onChange={(e) => onNameChange(e.currentTarget.value)}
          />
          <TextInput
            labelText="Introduction*"
            placeholder="23 y.o. designer from San Francisco"
            className="h-[79px]"
            onChange={(e) => onIntroChange(e.currentTarget.value)}
          />
          <div className="flex h-[56px] items-center justify-between">
            <div className="flex items-center justify-between">
              <Image
                src={"/images/x.png"}
                alt="x-logo"
                width={20}
                height={20}
              />
              <p className="ml-4 font-inter text-white">X Profile</p>
            </div>
            <TextInput
              placeholder="@jack_on_twitter"
              className="ml-[42px] h-[56px] text-white"
            />
          </div>
          <div className="flex h-[56px] items-center justify-between">
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
              className="ml-[42px] h-[56px]"
            />
          </div>
        </div>
        <div className="mt-[48px] flex justify-end gap-4">
          <DialogClose asChild>
            <Button variant="secondary" className="h-[52px] w-[110px]">
              <Image
                src={"/images/arrow-undo.png"}
                alt="arrow"
                width={16}
                height={16}
              />
              Back
            </Button>
          </DialogClose>
          <Button className="h-[52px] w-[212px]">
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
    </div>
  );
};
