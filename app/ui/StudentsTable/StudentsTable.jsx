"use client";
import {useMemo, useState, useCallback} from "react";
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
import useSWR, {mutate} from "swr";
import {EyeIcon} from "../Icons/EyeIcon";
import {EditIcon} from "../Icons/EditIcon";
import {DeleteIcon} from "../Icons/DeleteIcon";
import {deleteStudent} from "@/app/actions/studentsActions";
import {displayToast} from "@/app/ui/displayToast";
import {SearchIcon} from "@/app/ui/Icons/SearchIcon";
import {ChevronDownIcon} from "@/app/ui/Icons/ChevronDownIcon";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

    const INITIAL_VISIBLE_COLUMNS = ["id", "name", "phone", "className", "groupName", "actions"];
export default function StudentsTable() {
    const columns = [{name: "ID", uid: "id"}, {name: "NAME", uid: "name"}, {
        name: "PHONE", uid: "phone"
    }, {name: "CLASS", uid: "className"}, {name: "GROUP", uid: "groupName"}, {name: "ACTIONS", uid: "actions"},];
    const rowsPerPage = 5;
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [page, setPage] = useState(1);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [filterValue, setFilterValue] = useState("");
    const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));

    const headerColumns = useMemo(() => {
        if(visibleColumns.size === 0) {
            return [
                {name: "ID", uid: "id"},
            ];
        }
        return columns.filter((column) => visibleColumns.has(column.uid));
    }, [visibleColumns]);

    const handleDeleteClick = useCallback((student) => {
        setSelectedStudent(student);
        onOpen();
    }, [setSelectedStudent, onOpen]);

    const fields = useMemo(() => {
        return "name,code,groupName,className,phone"
    }, []);
    const handleDeleteConfirm = async () => {
        try {
            const req = await deleteStudent(selectedStudent.code);
            if (req.type === 'success') {
                displayToast(req)
                onOpenChange();
                await mutate(`${process.env.NEXT_PUBLIC_URL}/api/students?page=${page}&rowsPerPage=${rowsPerPage}}${filterValue ? `&name=${filterValue}` : ""}&fields=${fields}`);
                setIsLoaded(true)

            } else {
                displayToast(req)
            }
        } catch (e) {
            console.log(e);
        }
    };

    const {
        data, isLoading
    } = useSWR(`${process.env.NEXT_PUBLIC_URL}/api/students?page=${page}&rowsPerPage=${rowsPerPage}${filterValue ? `&name=${filterValue}` : ""}&fields=${fields}`, fetcher, {
        keepPreviousData: true, revalidateOnFocus: false, revalidateOnReconnect: false, revalidateOnMount: true,
    });
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

    const loadingState = isLoading || data.length === 0 || false ? "loading" : "idle";

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
            <div className="grid grid-cols-6 items-center">
                <Input
                    isClearable
                    size={"sm"}
                    placeholder="Search by name..."
                    startContent={<SearchIcon />}
                    value={filterValue}
                    onClear={() => onClear()}
                    onValueChange={onSearchChange}
                    className="col-start-1 col-end-3"
                />
                <span className="col-end-7 col-span-2 flex flex-row gap-2 justify-end">
                    <Dropdown className="w-fit">
                    <DropdownTrigger className="hidden tablet:flex">
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
                loadingState={loadingState}
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
