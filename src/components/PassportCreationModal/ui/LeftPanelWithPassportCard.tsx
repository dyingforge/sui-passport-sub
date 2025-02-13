import Image from "next/image";
import { type FC } from "react";
import { type ImageType } from "react-images-uploading";
import { cn } from "~/lib/utils";

type Props = {
  name: string;
  intro: string;
  avatar: ImageType | null;
};

export const LeftPanelWithPassportCard: FC<Props> = ({
  name,
  intro,
  avatar,
}) => {
  return (
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
        <div className="relative z-10 flex flex-col items-center">
          <Image
            src={"/images/default-avatar.png"}
            width={192}
            height={192}
            alt="avatar"
            className="mt-[70px]"
          />
          {avatar && (
            <img
              src={avatar.dataURL}
              alt="avatar"
              className="absolute mt-[89px] h-[154px] w-[154px] rounded-full object-cover"
            />
          )}
          <p
            className={cn(
              "mt-[68px] text-center font-everett text-[36px] leading-[43px] text-[#1b1d22]",
              name ? "text-[#fcf0d6]" : "",
            )}
          >
            {name ? name.toUpperCase() : "JOHN SMITH"}
          </p>
          <p
            className={cn(
              "mt-6 w-[240px] text-center font-everett_light text-[18px] text-[#1b1d22]",
              intro ? "text-[#fcf0d6]" : "",
            )}
          >
            {intro || "Short description, try to fit it in 1 short sentence"}
          </p>
        </div>
      </div>
    </div>
  );
};
