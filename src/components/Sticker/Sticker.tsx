

import Image from "next/image";
import { type FC } from "react";

type Props = { url: string };

export const Sticker: FC<Props> = ({url}) => {
  return (
      <Image
        src={url}
        alt="sticker"
        width={360}
        height={360}
        className="cursor-pointer object-none"
      />
  );
};
