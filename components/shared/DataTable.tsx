import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { EmptyState } from "./EmptyState"

export interface Column<T> {
  header: React.ReactNode
  accessorKey?: keyof T
  cell?: (item: T) => React.ReactNode
}

export interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  keyExtractor: (item: T) => string | number
  emptyState?: React.ReactNode
}

export function DataTable<T>({ data, columns, keyExtractor, emptyState }: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center min-h-[300px] border-none rounded-[2rem] bg-white shadow-premium dark:bg-slate-900 transition-all duration-500">
        {emptyState || <EmptyState title="No data found" description="There are no records to display at this time." />}
      </div>
    )
  }

  return (
    <div className="rounded-2xl md:rounded-[2.5rem] border-none bg-white text-slate-900 shadow-premium dark:bg-slate-900 dark:text-white overflow-hidden transition-all duration-500">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
            <TableRow className="hover:bg-transparent border-slate-100 dark:border-slate-800 h-16">
              {columns.map((col, index) => (
                <TableHead key={index} className="text-[11px] font-black uppercase text-slate-400 px-6 tracking-widest">
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow 
                key={keyExtractor(item)} 
                className="group border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all duration-300 h-20"
              >
                {columns.map((col, idx) => (
                  <TableCell key={idx} className="px-6 py-4 text-sm font-medium transition-transform group-hover:translate-x-0.5">
                    {col.cell ? col.cell(item) : col.accessorKey ? String(item[col.accessorKey]) : null}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
