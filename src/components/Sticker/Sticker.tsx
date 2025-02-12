import Image from "next/image";
import { type FC } from "react";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { TextInput } from "../TextInput/TextInput";

type Props = { 
  url: string
  name: string
};

export const Sticker: FC<Props> = (props) => {
  const { url, name } = props;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Image
          src={url}
          alt="sticker"
          width={360}
          height={360}
          className="cursor-pointer object-none"
          quality={100}
        />
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col h-full w-full items-center justify-center backdrop-blur-[8px]">
        <Image
          src={url}
          alt="sticker"
          width={480}
          height={480}
          quality={100}
        />
          <TextInput
            labelText="Claim Code"
            placeholder="1234-5678"
            className="mt-[103px] h-[79px]"
          />
          <div className="flex gap-2 mt-[48px]">
          <DialogClose asChild>
          <Button variant='secondary' className="h-[52px] w-[116px]">
             Close
            <Image
              src={"/images/cross.png"}
              alt="cross"
              width={16}
              height={16}
            />
          </Button>
          </DialogClose>
          <Button className="h-[52px] w-[227px]">
             Claim {name}
          </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
