import { AnimatedImage } from "~/components/AnimatedImage.tsx/AnimatedImage";
import { type StickerData } from "../stickers";
import { type StampItem } from "~/types/stamp";
import { useEffect, useMemo, useState } from "react";
import { stampsToStickerData } from "~/lib/utils";
import { useMediaQuery } from "react-responsive";

interface StickersLayoutProps {
  stamps: StampItem[];
  collections: string[];
  visitor: boolean;
  onStickerClick?: (id: string) => void;
  isLoading?: boolean;
}

export const StickersLayout = ({ stamps, collections, visitor, onStickerClick, isLoading }: StickersLayoutProps) => {
  const [stickerData, setStickerData] = useState<StickerData[]>([]);
  const isMobile = useMediaQuery({ query: `(max-width: 640px)` });

  useEffect(() => {
    setStickerData(stampsToStickerData(stamps, collections));
  }, [stamps, collections, visitor]);

  const stickersWidth = useMemo(() => {
    if (isMobile) return "auto";
    if (stickerData.length === 1) return "260px";
    if (stickerData.length === 2) return "600px";
    else return "1000px";
  }, [stickerData, isMobile]);

  return (
    <div className="flex w-auto flex-wrap justify-center gap-[16px] sm:h-screen sm:w-[1440px]">
      <div
        className="grid grid-cols-2 sm:relative"
        style={{
          width: stickersWidth,
        }}
      >
        {stickerData.map(
          ({
            id,
            isActive,
            url,
            name,
            rotation,
            size,
            top,
            left = "auto",
            right = "auto",
          }) => (
            <div
              key={id}  
              className={`flex h-[150px] w-[150px] flex-col items-center sm:absolute sm:h-auto sm:w-auto relative ${!isActive && onStickerClick && "cursor-pointer"}`}
              style={{
                top,
                left,
                right,
                transform: `rotate(${rotation}deg)`,
              }}
              onClick={() => !isActive && !isLoading && onStickerClick?.(id)}
            >
              <AnimatedImage
                src={url}
                width={size}
                height={size}
                alt="sticker"
                disabled={!isActive}
              />
              {!isActive && onStickerClick && (
                <div className="absolute inset-0 flex items-center hover:scale-110 transition-transform duration-200 justify-center bg-black/50">
                  <p className="font-everett text-[20px] uppercase text-white">
                    Click to get Points
                  </p>
                </div>
              )}
              <p className="absolute bottom-0 font-everett text-[14px] uppercase text-[#ABBDCC]">
                {name}
              </p>
            </div>
          ),
        )}
      </div>
    </div>
  );
};
