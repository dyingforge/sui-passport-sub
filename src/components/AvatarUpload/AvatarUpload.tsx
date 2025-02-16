import Image from "next/image";
import React, { type FC, useState } from "react";
import ImageUploading, {
  type ImageType,
  type ImageListType,
} from "react-images-uploading";
import { Button } from "../ui/button";

type AvatarUploadProps = {
  onImageUpload?: (imageData: ImageType | null) => void;
};

export const AvatarUpload: FC<AvatarUploadProps> = ({ onImageUpload }) => {
  const [images, setImages] = useState([]);

  const onChange = (imageList: ImageListType) => {
    setImages(imageList as never[]);
    onImageUpload?.(imageList?.[0] ? imageList[0] : null);
  };

  return (
    <div className="">
      <ImageUploading multiple value={images} onChange={onChange} maxNumber={1}>
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          dragProps,
          onImageUpdate,
        }) => (
          <div className="flex items-center justify-between font-inter">
            <div className="relative flex items-center gap-4 sm:gap-6">
              {imageList?.length === 0 && (
                <Image
                  src={"/images/avatar-upload.png"}
                  alt="avatar-upload"
                  width={80}
                  height={80}
                  className="h-[66px] w-[66px] sm:h-auto sm:w-auto"
                  {...dragProps}
                />
              )}
              {imageList?.length > 0 && imageList?.[0] && (
                <div className="relative h-[66px] w-[66px] sm:h-[80px] sm:w-[80px]">
                  <img
                    src={imageList?.[0].dataURL}
                    alt="avatar"
                    className="h-full w-full rounded-xl object-cover"
                  />
                  <div
                    onClick={() => onImageUpdate(0)}
                    className="absolute top-0 flex h-full w-full cursor-pointer items-center justify-center rounded-xl bg-[#02101C]/[.50] opacity-0 hover:opacity-100"
                  >
                    <Image
                      src={"/images/arrow-rotate.png"}
                      alt="arrow-rotate"
                      width={32}
                      height={32}
                    />
                  </div>
                </div>
              )}
              <div className="flex flex-col gap-[7px]">
                <h2 className="text-[16px] text-white sm:text-[20px]">
                  Profile Picture
                </h2>
                <button
                  onClick={onImageUpload}
                  {...dragProps}
                  className="flex text-[14px] text-[#ABBDCC]"
                >
                  <p>Drag and drop, or</p>
                  &nbsp;
                  <p className="underline">upload image</p>
                </button>
              </div>
            </div>
            {imageList?.length > 0 && (
              <Button variant="secondary" onClick={onImageRemoveAll}>
                <Image
                  src={"/images/trash.png"}
                  alt="trash"
                  width={16}
                  height={16}
                />
              </Button>
            )}
          </div>
        )}
      </ImageUploading>
    </div>
  );
};
