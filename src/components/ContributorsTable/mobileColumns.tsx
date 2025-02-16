/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import MiddleEllipsis from "react-middle-ellipsis";
import { type ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Button } from "../ui/button";
import { useSpring, animated } from "@react-spring/web";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { type Contributor } from "./columns";

export const mobileColumns: ColumnDef<Contributor>[] = [
  {
    accessorKey: "place",
    size: 48,
    header: "",
    cell: ({ cell }) => {
      const value = cell.getValue() as number;

      switch (value) {
        case 1: {
          return (
            <div className="flex h-[32px] w-[48px] items-center justify-center rounded-lg bg-[#FFCF4A] bg-opacity-20 text-[#FFCF4A] sm:h-[36px] sm:w-[80px]">
              1
            </div>
          );
        }
        case 2: {
          return (
            <div className="flex h-[32px] w-[48px] items-center justify-center rounded-lg bg-[#ABBDCC] bg-opacity-20 text-[#ABBDCC] sm:h-[36px] sm:w-[80px]">
              2
            </div>
          );
        }
        case 3: {
          return (
            <div className="flex h-[32px] w-[48px] items-center justify-center rounded-lg bg-[#CA5633] bg-opacity-20 text-[#CA5633] sm:h-[36px] sm:w-[80px]">
              3
            </div>
          );
        }
        default:
          return (
            <div className="flex h-[32px] w-[48px] items-center justify-center text-[#ABBDCC] opacity-50 sm:h-[36px] sm:w-[80px]">
              {value}
            </div>
          );
      }
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    size: 50,
    cell: ({ cell }) => {
      return (
        <p className="max-w-[80px] truncate text-[14px]">
          {cell.getValue() as string}
        </p>
      );
    },
  },
  {
    accessorKey: "address",
    header: "Address",
    size: 70,
    cell: ({ cell }) => {
      const [clicked, setClicked] = useState(false);
      const [isHovering, setIsHovering] = useState(false);

      const handleMouseEnter = () => {
        setIsHovering(true);
      };

      const handleMouseLeave = () => {
        setIsHovering(false);
      };

      const isMobile = useMediaQuery({ query: `(max-width: 760px)` });
      const showPosition = isMobile ? 0 : 20;
      const hiddenPosition = isMobile ? 20 : 40;

      const copyProps = useSpring({
        opacity: clicked ? 0 : 1,
        right: clicked ? hiddenPosition : showPosition,
      });
      const checkProps = useSpring({
        opacity: clicked ? 1 : 0,
        right: clicked ? showPosition : hiddenPosition,
      });

      return (
        <div
          className="relative flex w-[82px] cursor-pointer items-center gap-2 whitespace-nowrap"
          style={{ width: isMobile ? "82px" : "151px" }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => {
            if (!clicked) {
              setClicked(true);
              setTimeout(() => setClicked(false), 3000);
              void navigator.clipboard.writeText(cell.getValue() as string);
            }
          }}
        >
          <MiddleEllipsis>
            <p
              style={{
                color: clicked ? "#4DA2FF" : isHovering ? "white" : "#ABBDCC",
              }}
            >
              {cell.getValue() as string}
            </p>
          </MiddleEllipsis>
          <animated.div className="absolute" style={copyProps}>
            <Image
              src={"/images/squares.png"}
              alt="squares"
              width={16}
              height={16}
            />
          </animated.div>
          <animated.div className="absolute" style={checkProps}>
            <Image
              src={"/images/checkmark.png"}
              alt="checkmark"
              width={16}
              height={16}
            />
          </animated.div>
        </div>
      );
    },
  },
  {
    accessorKey: "points",
    header: "Points",
    size: 56,
    cell: ({ cell }) => (
      <div className="relative flex items-center gap-6">
        <span className="absolute flex gap-2 items-center">
          <Image
            src={"/images/drop.png"}
            alt="drop-icon"
            width={14}
            height={14}
            className="h-[15px] w-[12px]"
          />
          <p className="text-[#ABBDCC]">{cell.getValue() as string}</p>
          <Image
            src={"/images/chevron-right.png"}
            alt="drop-icon"
            width={16}
            height={16}
            className="h-[16px] w-[16px]"
          />
        </span>
        <Button
          variant="secondary"
          className="absolute right-0 hidden h-[44px] w-[109px] items-center gap-2"
        >
          Details
          <Image
            src={"/images/arrow-right.png"}
            alt="drop-icon"
            width={14}
            height={14}
          />
        </Button>
      </div>
    ),
  },
];
