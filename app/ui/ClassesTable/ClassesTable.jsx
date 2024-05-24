"use client"
import {useMemo, useState, useCallback} from "react";
import {
    Button,
    Input,
    Pagination,
    Spinner,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Tooltip
} from '@nextui-org/react'
import Link from 'next/link';
import React from 'react'
import useSWR from 'swr';
import {EyeIcon} from '../Icons/EyeIcon';
import {EditIcon} from '../Icons/EditIcon';
import {DeleteIcon} from '../Icons/DeleteIcon';
import {SearchIcon} from "@/app/ui/Icons/SearchIcon";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function ClassesTable() {
    const columns = [
        {name: "NAME", uid: "name"},
        {name:"NUMBER OF STUDENTS", uid:"numberOfStudents"},
        {name: "GROUPS", uid: "groups"},
        {name: "ACTIONS", uid: "actions"},
    ];

    const [page, setPage] = useState(1);
    const [filterValue, setFilterValue] = useState("");

    const rowsPerPage = 5;

    const {
        data,
        isLoading
    } = useSWR(`${process.env.NEXT_PUBLIC_URL}/api/classes?page=${page}&rowsPerPage=${rowsPerPage}${filterValue ? `&className=${filterValue}` : ""}`, fetcher, {
        keepPreviousData: true,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateOnMount: true,
    })

    const classes = useCallback(() => {
        if (data) {
            return data.classes;
        }
        return [];
    }, [data]);

    const count = useCallback(() => {
        if (data) {
            return data.count;
        }
        return 0;

    }, [data]);

    const classesData = classes()
    const classesCount = count()

    const pages = useMemo(() => {
        return classesCount ? Math.ceil(classesCount / rowsPerPage) : 1;
    }, [classesCount, rowsPerPage]);

    const renderCell = useCallback(
        (item, columnKey) => {
            const cellValue = classesData[columnKey];
            if (columnKey === "actions") {
                return (
                    <div className='relative flex items-center gap-2'>
                        <Tooltip content='Details'>
                            <Link
                                href={`/dashboard/classes/${item._id}`}
                                className='text-lg text-default-400 cursor-pointer active:opacity-50 bg-transparent'
                            >
                                <EyeIcon/>
                            </Link>
                        </Tooltip>
                        <Tooltip content='Edit Class'>
                            <Link href={`/dashboard/classes/${item._id}/edit`}
                                  className='text-lg text-default-400 cursor-pointer active:opacity-50'>
                                <EditIcon/>
                            </Link>
                        </Tooltip>
                        <Tooltip color='danger' content='Delete Class'>
              <span className='text-lg text-danger cursor-pointer active:opacity-50'>
                <DeleteIcon/>
              </span>
                        </Tooltip>
                    </div>
                );
            } else if (columnKey === "name") {
                return <span>{item.className}</span>;
            } else if (columnKey === "numberOfStudents") {
                return <span>{item.student_ids.length}</span>;
            }else if (columnKey === "groups") {
                return <span>{item.groups.length}</span>;
            } else {
                return cellValue
            }
        },
        [classesData]
    );

    const loadingState = isLoading || data.length === 0 ? "loading" : "idle";

    const onSearchChange = useCallback((value) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);

    const onClear = useCallback(() => {
        setFilterValue("");
        setPage(1)
    }, []);

    const topContent = useMemo(() => {
        return (<div className="flex justify-between gap-3 items-end">
            <Input
                isClearable
                className="w-full mobile:max-w-[calc(100%/3*2)] laptop:max-w-[50%]"
                size={"sm"}
                placeholder="Search by Class Name..."
                startContent={<SearchIcon/>}
                value={filterValue}
                onClear={() => onClear()}
                onValueChange={onSearchChange}
            />
            <Button
                as={Link}
                href={`/dashboard/addClass`}
                className='w-fit'
                color='primary'
                variant='shadow'
            >
                Add Class
            </Button>
        </div>);
    }, [ onSearchChange, filterValue, onClear]);

    return (
        <Table
            aria-label='Example table with client side pagination'
            topContent={topContent}
            topContentPlacement='outside'
            bottomContent={
                <div className='flex w-full justify-center'>
                    <Pagination
                        isCompact
                        showControls
                        showShadow
                        color='secondary'
                        page={page}
                        total={pages}
                        onChange={(page) => setPage(page)}
                    />
                </div>
            }
            classNames={{
                wrapper: "min-h-[222px]",
            }}
        >
            <TableHeader columns={columns}>
                {(column) => (
                    <TableColumn
                        key={column.uid}
                        align={column.uid === "actions" ? "center" : "start"}
                    >
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody
                items={classesData ? classesData : []}
                loadingContent={<Spinner/>}
                loadingState={loadingState}
                emptyContent={"No rows to display."}
            >
                {(item) => (
                    <TableRow key={item._id}>
                        {(columnKey) => (
                            <TableCell>{renderCell(item, columnKey)}</TableCell>
                        )}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}

export default ClassesTable