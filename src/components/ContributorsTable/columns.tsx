/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { type ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Button } from "../ui/button";
import { useSpring, animated } from "@react-spring/web";
import { useState } from "react";

export type Contributor = {
  name: string;
  place: number;
  address: string;
  stampsCollected: number;
  points: number;
};

export const columns: ColumnDef<Contributor>[] = [
  {
    accessorKey: "place",
    size: 98,
    header: "",
    cell: ({ cell }) => {
      const value = cell.getValue() as number;
      switch (value) {
        case 1: {
          return (
            <div className="flex h-[36px] w-[80px] items-center justify-center rounded-lg bg-[#FFCF4A] bg-opacity-20 text-[#FFCF4A]">
              1st
            </div>
          );
        }
        case 2: {
          return (
            <div className="flex h-[36px] w-[80px] items-center justify-center rounded-lg bg-[#ABBDCC] bg-opacity-20 text-[#ABBDCC]">
              2nd
            </div>
          );
        }
        case 3: {
          return (
            <div className="flex h-[36px] w-[80px] items-center justify-center rounded-lg bg-[#CA5633] bg-opacity-20 text-[#CA5633]">
              3rd
            </div>
          );
        }
        default:
          return (
            <div className="flex h-[36px] w-[80px] items-center justify-center text-[#ABBDCC] opacity-50">
              {value}
            </div>
          );
      }
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    size: 190,
  },
  {
    accessorKey: "address",
    header: "Address",
    size: 353,
    cell: ({ cell }) => {
      const [clicked, setClicked] = useState(false);
      const [isHovering, setIsHovering] = useState(false);

      const handleMouseEnter = () => {
        setIsHovering(true);
      };

      const handleMouseLeave = () => {
        setIsHovering(false);
      };

      const copyProps = useSpring({
        opacity: clicked ? 0 : 1,
        right: clicked ? 30 : 20,
      });
      const checkProps = useSpring({
        opacity: clicked ? 1 : 0,
        right: clicked ? 20 : 30,
      });

      return (
        <p
          onClick={() => {
            if (!clicked) {
              setClicked(true);
              setTimeout(() => setClicked(false), 3000);
              void navigator.clipboard.writeText(cell.getValue() as string);
            }
          }}
          className="relative flex w-[151px] cursor-pointer items-center gap-2"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            color: clicked ? "#4DA2FF" : isHovering ? "white" : "#ABBDCC",
          }}
        >
          {cell.getValue() as string}
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
        </p>
      );
    },
  },
  {
    accessorKey: "stampsCollected",
    header: "Stamps Collected",
    size: 268,
  },
  {
    accessorKey: "points",
    header: "Points",
    size: 90,
    cell: ({ cell }) => (
      <div className="relative flex items-center gap-6">
        <span className="absolute flex gap-2">
          <Image
            src={"/images/drop.png"}
            alt="drop-icon"
            width={14}
            height={14}
          />
          <p className="text-[#ABBDCC]">{cell.getValue() as string}</p>
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
