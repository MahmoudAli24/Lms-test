"use client";
import { useMemo, useState, useEffect } from "react";
import getStudents from "@/app/libs/getStudents";
import {
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
} from "@nextui-org/react";
import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function StudentsTable() {
  // const [students, setStudents] = useState([]); // Initialize students state
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const { data } = useSWR(
    `http://localhost:3000/api/students?page=${page}&rowsPerPage=${rowsPerPage}`,
    fetcher,
    { keepPreviousData: true, revalidateOnFocus: false , revalidateOnReconnect: false , revalidateOnMount: true }
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
  // const [pages, setPages] = useState(1);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const res = await getStudents(page, rowsPerPage);
  //       const { students: newStudents, count } = res;
  //       setStudents((prevStudents) => [...prevStudents, ...newStudents]); // Update students state with fetched data
  //       setPages(Math.ceil(count / rowsPerPage));
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   fetchData();
  // }, [page]);

  // const items = useMemo(() => {
  //   const start = (page - 1) * rowsPerPage;
  //   const end = start + rowsPerPage;
  //   return students.slice(start, end);
  // }, [page, students]);
  return (
    <>
      <Table
        color='primary'
        aria-label='Example table with client side pagination'
        isHeaderSticky
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
        <TableHeader>
          <TableColumn key='code'>ID</TableColumn>
          <TableColumn key='name'>Name</TableColumn>
        </TableHeader>
        <TableBody items={studentsData}>
          {(item) => (
            <TableRow key={item.code}>
              {(columnKey) => (
                <TableCell>{getKeyValue(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
