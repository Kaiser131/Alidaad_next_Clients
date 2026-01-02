import * as React from "react";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export function DataTable({
    columns,
    data,
}) {
    const [sorting, setSorting] = React.useState([]);
    const [columnFilters, setColumnFilters] = React.useState([]);
    const [columnVisibility, setColumnVisibility] = React.useState({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    return (
        <div className="space-y-4">
            <div className="rounded-md border bg-white overflow-x-auto">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id} className="border-b">
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="text-gray-500 font-semibold whitespace-nowrap">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    );
                                })}
                            </tr>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="border-b last:border-0"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="text-gray-500">
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-[60dvh] text-center"
                                >
                                    <p className="text-gray-500">No orders found</p>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm gap-4">
                <p className="text-gray-600">
                    Showing {table.getFilteredRowModel().rows.length} entries
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="px-3 py-1 border rounded flex items-center gap-1 w-full sm:w-auto justify-center"
                    >
                        <ChevronLeft size={16} /> Previous
                    </Button>
                    <div className="flex items-center gap-1 overflow-x-auto max-w-full">
                        {Array.from({ length: table.getPageCount() }, (_, i) => i + 1)
                            .slice(
                                Math.max(0, table.getState().pagination.pageIndex - 2),
                                Math.min(table.getPageCount(), table.getState().pagination.pageIndex + 4)
                            )
                            .map((page) => (
                                <Button
                                    key={page}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => table.setPageIndex(page - 1)}
                                    className={`px-3 py-1 border rounded ${table.getState().pagination.pageIndex === page - 1
                                            ? "bg-blue-500 text-white hover:bg-blue-600"
                                            : "bg-white hover:bg-gray-50"
                                        }`}
                                >
                                    {page}
                                </Button>
                            ))}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="px-3 py-1 border rounded flex items-center gap-1 w-full sm:w-auto justify-center"
                    >
                        Next <ChevronRight size={16} />
                    </Button>
                </div>
            </div>
        </div>
    );
}
