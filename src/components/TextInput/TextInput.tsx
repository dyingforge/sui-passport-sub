import { type ComponentProps, type FC } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { cn } from "~/lib/utils";

type TextInputProps = ComponentProps<"input"> & { labelText?: string };

export const TextInput: FC<TextInputProps> = (props) => {
  const { className, labelText, id, ...inputProps } = props;

  return (
    <div
      className={cn(
        "z-10 flex flex-col justify-center gap-1 rounded-2xl bg-gradient-to-r from-[#213244] from-20% via-[#13273d] to-[#17293c] px-4 py-3 text-[#ABBDCC] sm:px-6 sm:py-5",
        className,
      )}
    >
      {labelText && (
        <Label
          htmlFor={id}
          className="font-inter text-[14px] font-light leading-[18px]"
        >
          {labelText}
        </Label>
      )}
      <Input
        {...inputProps}
        className="h-[58px] font-inter text-[16px] leading-[20px] text-white sm:text-[20px] sm:leading-[24px]"
        id={id}
      />
    </div>
  );
};
