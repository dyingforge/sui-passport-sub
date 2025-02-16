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
    <div className="flex h-full w-full items-center justify-center backdrop-blur-[8px]">
      <div className="relative mx-[97px] my-8 flex h-[240px] w-[195px] flex-col items-center rounded-3xl bg-gradient-to-r from-[#1F2129] via-[#2e3036] to-[#1F2129] shadow-[0_73px_30px_0px_rgba(0,0,0,0.02)] sm:my-0 sm:mr-[165px] sm:h-[480px] sm:w-[390px]">
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
            className="mt-[35px] h-[96px] w-[96px] sm:mt-[70px] sm:h-auto sm:w-auto"
          />
          {avatar && (
            <img
              src={avatar.dataURL}
              alt="avatar"
              className="absolute mt-[46px] h-[76px] w-[76px] rounded-full object-cover sm:mt-[89px] sm:h-[154px] sm:w-[154px]"
            />
          )}
          <p
            className={cn(
              "mt-[34px] text-center font-everett text-[18px] leading-[22px] text-[#1b1d22] sm:mt-[68px] sm:text-[36px] sm:leading-[43px]",
              name ? "text-[#fcf0d6]" : "",
            )}
          >
            {name ? name.toUpperCase() : "JOHN SMITH"}
          </p>
          <p
            className={cn(
              "mt-3 w-[120px] text-center font-everett_light text-[9px] text-[#1b1d22] sm:mt-6 sm:w-[240px] sm:text-[18px]",
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
