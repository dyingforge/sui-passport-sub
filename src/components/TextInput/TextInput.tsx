import { type FC } from "react";
import { cn } from "~/lib/utils";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
}

export const TextInput: FC<TextInputProps> = ({ 
  label,
  className,
  ...props 
}) => {
  return (
    <div className="relative">
      {label && (
        <label className="absolute left-6 top-4 font-inter text-[14px] text-[#ABBDCC]">
          {label}
        </label>
      )}
      <input
        className={cn(
          "h-[66px] w-[358px] rounded-[20px] bg-[#1C2632] px-6 pt-10 font-inter text-[16px] text-white placeholder:text-[#ABBDCC] focus:outline-none sm:h-[79px] sm:w-[358px]",
          className
        )}
        {...props}
      />
    </div>
  );
};
