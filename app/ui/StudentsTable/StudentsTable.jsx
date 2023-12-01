"use client";
import { useMemo, useState } from "react";
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

export default function StudentsTable({ users }) {
  const [page, setPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const rowsPerPage = 5;
  const pages = Math.ceil(users.length / rowsPerPage);

  const handleSelectionChange = (selected) => {
    // Convert Set to an array
    const selectedArray = [...selected];

    // Access the value
    const selectedValue = selectedArray[0];

    // Now you can use selectedValue as needed
    console.log("Selected Value:", selectedValue);
    // You can also update your component state with the selected value if needed
  };

  console.log("selectedRows => ", selectedRows);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return users.slice(start, end);
  }, [page, users]);
  return (
    <>
      <Table
        color='primary'
        aria-label='Example table with client side pagination'
        isHeaderSticky
        onSelectionChange={(selected) => handleSelectionChange(selected)}
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
        <TableBody items={items}>
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
