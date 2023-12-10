"use client";
import { useMemo, useState, useCallback } from "react";
import Link from "next/link";

import {
  Button,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@nextui-org/react";
import useSWR from "swr";
import { EyeIcon } from "../Icons/EyeIcon";
import { EditIcon } from "../Icons/EditIcon";
import { DeleteIcon } from "../Icons/DeleteIcon";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function StudentsTable() {
  const columns = [
    { name: "ID", uid: "id" },
    { name: "NAME", uid: "name" },
    { name: "ACTIONS", uid: "actions" },
  ];
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const { data, isLoading } = useSWR(
    `https://lms-test-pi.vercel.app/api/students?page=${page}&rowsPerPage=${rowsPerPage}`,
    fetcher,
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateOnMount: true,
    }
  );
  const students = () => {
    if (data) {
      return data.students;
    }
    return [];
  };

  const count = () => {
    if (data) {
      return data.count;
    }
    return 0;
  };

  const studentsData = students();
  const studentsCount = count();

  const pages = useMemo(() => {
    return studentsCount ? Math.ceil(studentsCount / rowsPerPage) : 1;
  }, [studentsCount, rowsPerPage]);

  const renderCell = useCallback(
    (item, columnKey) => {
      const cellValue = studentsData[columnKey];
      if (columnKey === "actions") {
        return (
          <div className='relative flex items-center gap-2'>
            <Tooltip content='Details'>
              <Link
                href={`/dashboard/students/${item.code}`}
                className='text-lg text-default-400 cursor-pointer active:opacity-50 bg-transparent'
              >
                <EyeIcon />
              </Link>
            </Tooltip>
            <Tooltip content='Edit Student'>
              <span className='text-lg text-default-400 cursor-pointer active:opacity-50'>
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip color='danger' content='Delete Student'>
              <span className='text-lg text-danger cursor-pointer active:opacity-50'>
                <DeleteIcon />
              </span>
            </Tooltip>
          </div>
        );
      } else if (columnKey === "name") {
        return <span>{item.name}</span>;
      } else if (columnKey === "id") {
        return <span>{item.code}</span>;
      } else {
        return cellValue;
      }
    },
    [studentsData]
  );

  const loadingState = isLoading || data.length === 0 || data === undefined  ? "loading" : "idle";

  const topContent = useMemo(() => {
    return (
      <Button
        as={Link}
        href={`/dashboard/addStudent`}
        className='w-fit'
        color='primary'
        variant='shadow'
      >
        Add Student
      </Button>
    );
  }, []);

  return (
    <>
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
          items={studentsData ? studentsData : []}
          loadingContent={<Spinner />}
          loadingState={loadingState}
          emptyContent={"No rows to display."}
        >
          {(item) => (
            <TableRow key={item.code}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
