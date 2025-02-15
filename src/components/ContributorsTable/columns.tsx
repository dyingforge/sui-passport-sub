"use client";
import { type ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Button } from "../ui/button";

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
    cell: ({ cell }) => (
      <p className="text-[#ABBDCC]">{cell.getValue() as string}</p>
    ),
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
      <div className="flex gap-6 items-center relative">
        <span className="flex gap-2 absolute">
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
          className="absolute h-[44px] w-[109px] items-center gap-2 hidden right-0"
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
