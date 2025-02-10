import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "../ui/button";
import Image from "next/image";

export const PassportCreationModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="z-10 mt-12 h-[52px] w-[188px]">
          Get Your Passport
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="flex h-screen items-center">
          <div className="flex h-full w-full items-center justify-end backdrop-blur-[8px]">
            <div className="relative mr-[165px] flex h-[480px] w-[390px] flex-col items-center rounded-3xl bg-gradient-to-r from-[#1F2129] via-[#2e3036] to-[#1F2129] shadow-[0_73px_30px_0px_rgba(0,0,0,0.02)]">
              <Image
                src={"/images/card-back.png"}
                width={390}
                height={480}
                alt="card-back"
                className="absolute"
                unoptimized
              />
              <div className="z-10 flex flex-col items-center">
                <Image
                  src={"/images/default-avatar.png"}
                  width={192}
                  height={192}
                  alt="avatar"
                  className="mt-[70px]"
                />
                <p className="mt-[68px] text-center font-everett text-[36px] leading-[43px] text-[#1b1d22]">
                  JOHN SMITH
                </p>
                <p className="mt-6 w-[240px] text-center font-everett_light text-[18px] text-[#1b1d22]">
                  Short description, try to fit it in 1 short sentence
                </p>
              </div>
            </div>
          </div>
          <div className="flex h-full w-full justify-start items-center backdrop-blur-3xl">
            <div className="flex flex-col h-[600px] ml-[100px] justify-between">
              <h1 className="font-everett text-[32px] leading-[38px] text-white">
                Let’s get you a passport
              </h1>
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
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
