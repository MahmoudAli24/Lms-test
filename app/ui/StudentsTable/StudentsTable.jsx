"use client";
import {useMemo, useState, useCallback} from "react";
import Link from "next/link";

import {
    Button,
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
import {displayToast} from "@/app/ui/displayToast ";
import {SearchIcon} from "@/app/ui/Icons/SearchIcon";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function StudentsTable() {
    const columns = [{name: "ID", uid: "id"}, {name: "NAME", uid: "name"}, {name: "ACTIONS", uid: "actions"},];
    const rowsPerPage = 5;
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [page, setPage] = useState(1);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [filterValue, setFilterValue] = useState("");

    const handleDeleteClick = (student) => {
        setSelectedStudent(student);
        onOpen();
    };
    const handleDeleteConfirm = async () => {
        try {
            const req = await deleteStudent(selectedStudent.code);
            if (req.type === 'success') {
                displayToast(req)
                onOpenChange();
                await mutate(`${process.env.NEXT_PUBLIC_URL}/api/students?page=${page}&rowsPerPage=${rowsPerPage}}${filterValue ? `&name=${filterValue}` : ""}`);
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
    } = useSWR(`${process.env.NEXT_PUBLIC_URL}/api/students?page=${page}&rowsPerPage=${rowsPerPage}${filterValue ? `&name=${filterValue}` : ""}`, fetcher, {
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
        } else {
            return cellValue;
        }
    }, [studentsData]);

    const loadingState = isLoading || data.length === 0 || data === undefined ? "loading" : "idle";

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
                placeholder="Search by name..."
                startContent={<SearchIcon/>}
                value={filterValue}
                onClear={() => onClear()}
                onValueChange={onSearchChange}
            />
            <Button
                as={Link}
                href={`/dashboard/addStudent`}
                className='w-fit'
                color='primary'
                variant='shadow'
            >
                Add Student
            </Button>
        </div>);
    }, [onSearchChange, filterValue, onClear]);

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
            <TableHeader columns={columns}>
                {(column) => (<TableColumn
                    key={column.uid}
                    align={column.uid === "actions" ? "right" : column.uid === "id" ? "left" : "center"}
                >
                    {column.name}
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
