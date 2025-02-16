"use client";

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

interface ContributorsTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function ContributorsTable<TData, TValue>({
  columns,
  data,
}: ContributorsTableProps<TData, TValue>) {
  const [globalFilter, setGlobalFilter] = useState<ColumnFiltersState>([]);
  const [filterValue, setFilterValue] = useState<string>("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: {
      globalFilter,
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
          className="h-[44px] sm:h-[52px] w-[358px] sm:w-[360px] rounded-3xl bg-[#ABBDCC1A] text-center font-inter text-[14px] sm:text-[16px] text-[#ABBDCC80]"
          placeholder="Search by address or name"
          value={filterValue}
          onChange={(event) => {
            table.setGlobalFilter(event.target.value);
            setFilterValue(event.target.value ?? "");
          }}
        />
      </div>
      <div className="relative mt-12 flex w-[1000px] flex-col items-center justify-center font-inter [&_tbody]:before:block [&_tbody]:before:h-[34px] [&_tbody]:before:content-['']">
        <div className="absolute top-0 h-[60px] w-[1000px] hidden sm:block rounded-lg bg-black bg-opacity-20" />
        <Table>
          <TableHeader className="h-[60px] hidden sm:table-header-group">
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
                  className="[&_button]:hover:flex [&_span]:hover:left-[-110px] bg-[#ABBDCC1A] sm:bg-transparent"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
        <span className="mt-[81px] flex gap-2 font-inter text-[16px] text-[#ABBDCC]">
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
