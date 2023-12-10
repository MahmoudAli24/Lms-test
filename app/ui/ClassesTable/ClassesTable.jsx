"use client"
import { useMemo, useState, useCallback } from "react";
import { Button, Pagination, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from '@nextui-org/react'
import Link from 'next/link';
import React from 'react'
import useSWR from 'swr';
import { EyeIcon } from '../Icons/EyeIcon';
import { EditIcon } from '../Icons/EditIcon';
import { DeleteIcon } from '../Icons/DeleteIcon';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function ClassesTable() {
  const columns = [
    { name: "NAME", uid: "name" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const { data, isLoading } = useSWR(`http://localhost:3000/api/classes?page=${page}&rowsPerPage=${rowsPerPage}`, fetcher, {
    keepPreviousData: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateOnMount: true,
  })
  const classes = () => {
    if (data) {
      return data.classes
    }
    return []
  }

  const count = () => {
    if (data) {
      return data.count;
    }
    return 0;
  };

  const classesData = classes()
  const classesCount = count()
  console.log("classesData", classesData)

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
                <EyeIcon />
              </Link>
            </Tooltip>
            <Tooltip content='Edit Class'>
              <span className='text-lg text-default-400 cursor-pointer active:opacity-50'>
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip color='danger' content='Delete Class'>
              <span className='text-lg text-danger cursor-pointer active:opacity-50'>
                <DeleteIcon />
              </span>
            </Tooltip>
          </div>
        );
      } else if (columnKey === "name") {
        return <span>{item.className}</span>;
      } else {
        return cellValue;
      }
    },
    [classesData]
  );

  const loadingState = isLoading || data.length === 0 ? "loading" : "idle";

  const topContent = useMemo(() => {
    return (
      <Button
        as={Link}
        href={`/dashboard/addClass`}
        className='w-fit'
        color='primary'
        variant='shadow'
      >
        Add Class
      </Button>
    );
  }, []);

  return (
    <Table
      color='primary'
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
            align={
              column.uid === "actions"
                ? "right"
                : column.uid === "id"
                  ? "left"
                  : "center"
            }
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        items={classesData ? classesData : []}
        loadingContent={<Spinner />}
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