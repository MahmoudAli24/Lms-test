"use client";
import {useCallback, useEffect, useMemo, useState} from "react";
import Link from "next/link";

import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Pagination,
    Spinner,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Tooltip,
    useDisclosure,
} from "@nextui-org/react";
import {EyeIcon} from "../Icons/EyeIcon";
import {EditIcon} from "../Icons/EditIcon";
import {DeleteIcon} from "../Icons/DeleteIcon";
import {deleteStudent, getStudentsPagination} from "@/app/actions/studentsActions";
import {displayToast} from "@/app/ui/displayToast";
import {SearchIcon} from "@/app/ui/Icons/SearchIcon";
import {ChevronDownIcon} from "@/app/ui/Icons/ChevronDownIcon";
import {revalidateTag} from "next/cache";

    const INITIAL_VISIBLE_COLUMNS = ["id", "name", "phone", "className", "groupName", "actions"];
export default function StudentsTable() {
    const columns = useMemo(() => {
        return [{name: "ID", uid: "id"}, {name: "NAME", uid: "name"}, {
            name: "PHONE", uid: "phone"
        }, {name: "CLASS", uid: "className"}, {name: "GROUP", uid: "groupName"}, {name: "ACTIONS", uid: "actions"},];
    }, []);
    const rowsPerPage = 5;
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [page, setPage] = useState(1);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [filterValue, setFilterValue] = useState("");
    const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
    const [studentsData, setStudentsData] = useState([]);
    const [studentsCount , setStudentsCount] = useState(0);
    const [isLoading ,setIsLoaded] = useState(false);

    const headerColumns = useMemo(() => {
        if(visibleColumns.size === 0) {
            return [
                {name: "ID", uid: "id"},
            ];
        }
        return columns.filter((column) => visibleColumns.has(column.uid));
    }, [columns, visibleColumns]);

    const handleDeleteClick = useCallback((student) => {
        setSelectedStudent(student);
        onOpen();
    }, [setSelectedStudent, onOpen]);

    const fields = useMemo(() => {
        return "name,code,groupName,className,phone"
    }, []);
    const handleDeleteConfirm = async () => {
        try {
            setIsLoaded(true)
            const req = await deleteStudent(selectedStudent.code);
            if (req.type === 'success') {
                displayToast(req)
                onOpenChange();
                await fetchStudentsData()
                revalidateTag('students')
                setPage(page-1)
                setIsLoaded(false)

            } else {
                displayToast(req)
            }
        } catch (e) {
            console.log(e);
        }
    };
    const fetchStudentsData = useCallback(async () => {
        try {
            setIsLoaded(true)
            const {students , count} = await getStudentsPagination(fields, page, rowsPerPage, filterValue);
            setStudentsData(students);
            setStudentsCount(count);
            setIsLoaded(false)
            return students;
        } catch (e) {
            console.log(e);
        }
    }, [fields, page, filterValue]);
    
    useEffect(() => {
           fetchStudentsData();
    }, [fetchStudentsData]);


    const pages = useMemo(() => {
        return studentsCount ? Math.ceil(studentsCount / rowsPerPage) : 1;
    }, [studentsCount, rowsPerPage]);

    const renderCell = useCallback((item, columnKey) => {
        const cellValue = studentsData[columnKey];
        if (columnKey === "actions") {
            return (<div className='relative flex items-center gap-2'>
                <Tooltip content='Details'>
                    <Link
                        href={`/dashboard/students/${item.code}`}
                        className='text-lg text-default-400 cursor-pointer active:opacity-50 bg-transparent'
                    >
                        <EyeIcon/>
                    </Link>
                </Tooltip>
                <Tooltip content='Edit Student'>
                    <Link
                        href={`/dashboard/students/${item.code}/edit`}
                        className='text-lg text-default-400 cursor-pointer active:opacity-50'>
                        <EditIcon/>
                    </Link>
                </Tooltip>
                <Tooltip color='danger' content='Delete Student'>
                        <span className="text-lg text-danger cursor-pointer active:opacity-50"
                              onClick={() => handleDeleteClick(item)}>
                        <DeleteIcon/>
                        </span>
                </Tooltip>
            </div>);
        } else if (columnKey === "name") {
            return <span>{item.name}</span>;
        } else if (columnKey === "id") {
            return <span>{item.code}</span>;
        } else if (columnKey === "groupName") {
            return <span>{item.groupName}</span>;
        } else if (columnKey === "className") {
            return <span>{item.className}</span>;
        } else if (columnKey === "phone") {
            return <span>{item.phone}</span>;
        } else {
            return cellValue;
        }
    }, [studentsData, handleDeleteClick]);


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
        return (
            <div className="tablet:grid laptop:grid-cols-6 tablet:grid-cols-2 grid-cols-1 gap-2 items-center flex flex-col">
                <Input
                    isClearable
                    size={"sm"}
                    placeholder="Search by name..."
                    startContent={<SearchIcon />}
                    value={filterValue}
                    onClear={() => onClear()}
                    onValueChange={onSearchChange}
                    className="tablet:col-start-1 tablet:col-end-3"
                />
                <span className="col-end-7 col-span-2 flex flex-row gap-2 justify-end">
                    <Dropdown className="w-fit">
                    <DropdownTrigger className="flex">
                        <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                            Columns
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        disallowEmptySelection
                        aria-label="Table Columns"
                        closeOnSelect={false}
                        selectedKeys={visibleColumns}
                        selectionMode="multiple"
                        onSelectionChange={setVisibleColumns}
                    >
                        {columns.map((column) => (
                            <DropdownItem key={column.uid}>
                                {column.name}
                            </DropdownItem>
                        ))}
                    </DropdownMenu>
                </Dropdown>
                <Button
                    as={Link}
                    href={`/dashboard/addStudent`}
                    className="w-fit"
                    color="primary"
                    variant="shadow"
                >
                    Add Student
                </Button>
                </span>
            </div>
        );
    }, [onSearchChange, filterValue, onClear, visibleColumns]);

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }


    return (<>
        <Table
            color='primary'
            aria-label='Example table with client side pagination'
            topContent={topContent}
            topContentPlacement='outside'
            bottomContent={<div className='flex w-full justify-center'>
                <Pagination
                    isCompact
                    showControls
                    showShadow
                    color='secondary'
                    page={page}
                    total={pages}
                    onChange={(page) => setPage(page)}
                />
            </div>}
            classNames={{
                wrapper: "min-h-[222px]",
            }}
        >
            <TableHeader columns={headerColumns}>
                {(column) => (<TableColumn
                    key={column.uid}
                    align={column.uid === "actions" ? "right" : column.uid === "id" ? "left" : "center"}
                >
                    {capitalize(column.name)}
                </TableColumn>)}
            </TableHeader>
            <TableBody
                items={studentsData ? studentsData : []}
                loadingContent={<Spinner/>}
                loadingState={isLoading ? "loading" : "idle"}
                emptyContent={"No rows to display."}
            >
                {(item) => (<TableRow key={item.code}>
                    {(columnKey) => (<TableCell>{renderCell(item, columnKey)}</TableCell>)}
                </TableRow>)}
            </TableBody>
        </Table>
        {isOpen && <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement={"center"}
            backdrop={"blur"}
            hideScroll
            size='mini'
            className='w-[300px]'
        >
            <ModalContent>
                {(onClose) => (<>
                    <ModalHeader>Delete Student</ModalHeader>
                    <ModalBody>
                        Are you sure you want to delete {selectedStudent && selectedStudent.name}?
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color='error'
                            auto
                            onClick={() => {
                                onClose();
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            color='success'
                            auto
                            onClick={handleDeleteConfirm}
                        >
                            Delete
                        </Button>
                    </ModalFooter>
                </>)}
            </ModalContent>
        </Modal>}
    </>);
}
