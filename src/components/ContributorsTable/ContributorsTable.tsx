"use client";

import { useMediaQuery } from "react-responsive";
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import Image from "next/image";
import { useState } from "react";
import { Input } from "../ui/input";
import { mobileColumns } from "./mobileColumns";
import { columns } from "./columns";

interface ContributorsTableProps<TData, TValue> {
  data: TData[];
}

export function ContributorsTable<TData, TValue>({
  data,
}: ContributorsTableProps<TData, TValue>) {
  const [globalFilter, setGlobalFilter] = useState<ColumnFiltersState>([]);
  const [filterValue, setFilterValue] = useState<string>("");

  const isMobile = useMediaQuery({ query: `(max-width: 760px)` });
  const tableColumns = (isMobile ? mobileColumns : columns) as ColumnDef<
    TData,
    TValue
  >[];

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: {
      globalFilter,
      columnVisibility: isMobile ? { stampsCollected: false } : {},
    },
  });

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center">
        {!filterValue && (
          <Image
            src={"/images/search.png"}
            alt="search"
            width={20}
            height={20}
            className="absolute left-[63px] sm:left-[52px]"
          />
        )}
        <Input
          className="h-[44px] w-[358px] rounded-3xl bg-[#ABBDCC1A] text-center font-inter text-[14px] text-[#ABBDCC80] sm:h-[52px] sm:w-[360px] sm:text-[16px]"
          placeholder="Search by address or name"
          value={filterValue}
          onChange={(event) => {
            table.setGlobalFilter(event.target.value);
            setFilterValue(event.target.value ?? "");
          }}
        />
      </div>
      <div className="relative mt-12 flex w-[358px] flex-col items-center justify-center font-inter sm:w-[1000px] sm:[&_tbody]:before:block sm:[&_tbody]:before:h-[34px] sm:[&_tbody]:before:content-['']">
        <div className="absolute top-0 hidden h-[60px] w-[1000px] rounded-lg bg-black bg-opacity-20 sm:block" />
        <Table className="border-separate sm:border-collapse border-spacing-y-2">
          <TableHeader className="hidden h-[60px] sm:table-header-group">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="text-white"
                      style={{
                        width: `${header.getSize()}px`,
                        maxWidth: `${header.getSize()}px`,
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="sm:[&_button]:hover:flex sm:[&_span]:hover:left-[-110px] rounded-2xl overflow-hidden"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="bg-[#ABBDCC1A] px-1 first:pl-2 last:pr-2 first:rounded-l-2xl last:rounded-r-2xl sm:bg-transparent"
                      style={{
                        width: `${cell.column.getSize()}px`,
                        maxWidth: `${cell.column.getSize()}px`,
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <span className="mt-[44px] sm:mt-[81px] flex gap-2 font-inter text-[16px] text-[#ABBDCC]">
          <Image
            src={"/images/loader.png"}
            width={24}
            height={24}
            alt="loader"
          />
          Wait a sec, we’re still loading
        </span>
      </div>
    </div>
  );
}
