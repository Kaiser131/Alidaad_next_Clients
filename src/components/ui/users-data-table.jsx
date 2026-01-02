import * as React from "react";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function UsersDataTable({
    columns,
    data,
}) {
    const [sorting, setSorting] = React.useState([]);
    const [columnFilters, setColumnFilters] = React.useState([]);
    const [columnVisibility, setColumnVisibility] = React.useState({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [globalFilter, setGlobalFilter] = React.useState("");

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
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: (row, columnId, filterValue) => {
            const search = filterValue.toLowerCase();
            const email = row.original.email?.toLowerCase() || "";
            const name = row.original.name?.toLowerCase() || "";

            return email.includes(search) || name.includes(search);
        },
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter,
        },
    });

    return (
        <div className="space-y-4">
            {/* Search Input */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        placeholder="Search by name or email..."
                        value={globalFilter ?? ""}
                        onChange={(event) => setGlobalFilter(event.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="text-sm text-gray-600">
                    Total Users: <span className="font-semibold">{data.length}</span>
                </div>
            </div>

            {/* Table */}
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
                                    className="h-[400px] text-center"
                                >
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Search className="w-12 h-12 text-gray-300" />
                                        <p className="text-gray-500">No users found</p>
                                        {globalFilter && (
                                            <p className="text-sm text-gray-400">
                                                Try adjusting your search
                                            </p>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm gap-4">
                <p className="text-gray-600">
                    Showing{" "}
                    <span className="font-semibold">
                        {table.getFilteredRowModel().rows.length}
                    </span>{" "}
                    of <span className="font-semibold">{data.length}</span> users
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
