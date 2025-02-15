import { AnimatedImage } from "~/components/AnimatedImage.tsx/AnimatedImage";
import { stickers } from "../stickers";

export const StickersLayout = () => {
  return (
    <div className="relative flex w-[1440px] h-screen">
      {stickers.map(
        ({ url, name, rotation, size, top, left = "auto", right = "auto" }) => (
          <div
            key={url}
            className={`absolute flex flex-col items-center`}
            style={{
              top,
              left,
              right,
              transform: `rotate(${rotation}deg)`,
            }}
          >
            <AnimatedImage src={url} width={size} height={size} alt="sticker" />
            <p className="absolute bottom-0 font-everett uppercase text-[#ABBDCC]">
              {name}
            </p>
          </div>
        ),
      )}
    </div>
  );
};
