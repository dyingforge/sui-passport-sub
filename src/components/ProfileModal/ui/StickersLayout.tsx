import { AnimatedImage } from "~/components/AnimatedImage.tsx/AnimatedImage";
import { stickers } from "../stickers";

export const StickersLayout = () => {
  return (
    <div className="relative flex w-auto flex-wrap justify-center gap-[16px] sm:h-screen sm:w-[1440px]">
      {stickers.map(
        ({ url, name, rotation, size, top, left = "auto", right = "auto" }) => (
          <div
            key={url}
            className={`flex h-[150px] w-[150px] flex-col items-center sm:absolute sm:h-auto sm:w-auto`}
            style={{
              top,
              left,
              right,
              transform: `rotate(${rotation}deg)`,
            }}
          >
            <AnimatedImage src={url} width={size} height={size} alt="sticker" />
            <p className="absolute bottom-0 font-everett text-[14px] uppercase text-[#ABBDCC]">
              {name}
            </p>
          </div>
        ),
      )}
    </div>
  );
};
