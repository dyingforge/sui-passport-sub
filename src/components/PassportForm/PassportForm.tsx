import { TextInput } from "../TextInput/TextInput";
import Image from "next/image";
import { Button } from "../ui/button";
import { DialogClose } from "../ui/dialog";
import { type FC } from "react";
import { AvatarUpload } from "../AvatarUpload/AvatarUpload";
import { type ImageType } from "react-images-uploading";

type PassportForm = {
  onNameChange: (name: string) => void;
  name: string | undefined
  onIntroChange: (intro: string) => void;
  onAvatarChange: (avatar: ImageType | null) => void;
};

export const PassportForm: FC<PassportForm> = ({
  onNameChange,
  onIntroChange,
  onAvatarChange,
  name,
}) => {
  return (
    <div className="flex h-full w-full items-center justify-start backdrop-blur-3xl">
      <div className="mx-4 flex sm:h-[600px] flex-col sm:ml-[100px]">
        <h1 className="font-everett text-[24px] leading-[24px] text-white sm:text-[32px] sm:leading-[38px]">
          Let’s get you a passport
        </h1>
        <div className="mt-8 sm:mt-12">
          <AvatarUpload onImageUpload={onAvatarChange} />
        </div>
        <div className="mt-4 flex w-[358px] flex-col gap-4 sm:w-[520px]">
          <TextInput
            labelText="Your Name*"
            placeholder="John Smith"
            className="h-[66px] sm:h-[79px]"
            value={name ?? ''}
            onChange={(e) => onNameChange(e.currentTarget.value)}
          />
          <TextInput
            labelText="Introduction"
            placeholder="23 y.o. designer from San Francisco"
            className="h-[66px] sm:h-[79px]"
            onChange={(e) => onIntroChange(e.currentTarget.value)}
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
            />
          </div>
        </div>
        <div className="mt-[48px] mb-[25px] flex justify-end gap-4">
          <DialogClose asChild>
            <Button
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
          <Button className="h-[42px] w-[202px] sm:h-[52px] sm:w-[212px]">
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
