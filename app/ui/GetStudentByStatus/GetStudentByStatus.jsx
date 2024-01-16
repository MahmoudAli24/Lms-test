"use client"
import {
    Input, Pagination, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip
} from "@nextui-org/react";
import {Select, SelectItem} from "@nextui-org/select";
import {useCallback, useEffect, useMemo, useState} from "react";
import {getAbsentsStudents} from "@/app/actions/studentsActions";
import {format} from "date-fns";
import Link from "next/link";
import {EyeIcon} from "@/app/ui/Icons/EyeIcon";
import {EditIcon} from "@/app/ui/Icons/EditIcon";
import {calculateAttendancePercentage} from "@/app/functions/attendanceAnalysis";
const statusOptions = [{value: "absent", label: "Absent"}, {value: "present", label: "Present"}, {
    value: "late", label: "Late"}]

function GetStudentByStatus({classesOptions, groupsOptions}) {
    const [selectedClass, setSelectedClass] = useState(`${classesOptions[0].value}`)
    const groups = groupsOptions && groupsOptions.filter((item) => item.class_id === selectedClass)
    const [selectedGroups, setSelectedGroups] = useState(`${groups[0].value}`)
    const [selectedStatus, setSelectedStatus] = useState(`absent`)
    const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"))
    const [selectedStudents, setSelectedStudents] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [page, setPage] = useState(1);
    const [studentsCount, setStudentsCount] = useState(0);
    const rowsPerPage = 5;

    const pages = useMemo(() => {
        return studentsCount ? Math.ceil(studentsCount / rowsPerPage) : 1;
    }, [studentsCount, rowsPerPage]);

    const fetchStudentsStatus = async () => {
        try {
            setIsLoading(true)
            const {absentStudents ,count} = await getAbsentsStudents(selectedDate, selectedGroups, selectedStatus , page, rowsPerPage)
            const students = absentStudents.map((item) => {
                return {
                    ...item,
                    attendancePercent: calculateAttendancePercentage(item.student),
                }
            })
            setSelectedStudents(students)
            setStudentsCount(count)
            setIsLoading(false)
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        if (selectedClass && selectedGroups && selectedStatus && selectedDate) {
            fetchStudentsStatus()
        }
    }, [selectedClass, selectedGroups, selectedStatus, selectedDate , page ]);

    const columns = [{name: "ID", uid: "id"}, {name: "NAME", uid: "name"}, {
        name: "PHONE", uid: "phone"
    },{name:"Attendance Percent", uid:"attendancePercent"}, {name: "ACTIONS", uid: "actions"},];

    const renderCell = useCallback((item, columnKey) => {
        const cellValue = selectedStudents[columnKey];
        if (columnKey === "actions") {
            return (<div className='relative flex items-center gap-2'>
                <Tooltip content='Details'>
                    <Link
                        href={`/dashboard/students/${item.student.code}`}
                        className='text-lg text-default-400 cursor-pointer active:opacity-50 bg-transparent'
                    >
                        <EyeIcon/>
                    </Link>
                </Tooltip>
                <Tooltip content='Edit Student'>
                    <Link
                        href={`/dashboard/students/${item.student.code}/edit`}
                        className='text-lg text-default-400 cursor-pointer active:opacity-50'>
                        <EditIcon/>
                    </Link>
                </Tooltip>
            </div>);
        } else if (columnKey === "name") {
            return <span>{item.student.name}</span>;
        } else if (columnKey === "id") {
            return <span>{item.student.code}</span>;
        } else if (columnKey === "phone") {
            return <span>{item.student.phone}</span>;
        } else if (columnKey === "attendancePercent") {
            return <span className="text-blue-500">{item.attendancePercent}</span>;
        } else {
            return cellValue;
        }
    }, [selectedStudents]);


    return (<div className="laptop:grid laptop:grid-cols-9 gap-3 flex flex-col-reverse">
        <div className="laptop:col-span-6">
            <Table
                color={"secondary"}
                isStriped={true}
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
                    items={selectedStudents ? selectedStudents : []}
                    emptyContent={"No Students Found"}
                    loadingState={isLoading ? "loading" : "idle"}
                    loadingContent={<Spinner/>}
                >
                    {(item) => (<TableRow key={item._id}>
                        {(columnKey) => (<TableCell>{renderCell(item, columnKey)}</TableCell>)}
                    </TableRow>)}
                </TableBody>
            </Table>
        </div>
        <div className="laptop:grid laptop:grid-cols-1 laptop:col-span-3">
            <Select color="primary" variant="underlined"
                    aria-label="gi"
                    selectedKeys={[selectedStatus]}
                    onChange={(e) => setSelectedStatus(e.target.value)}
            >
                {statusOptions.map((item) => (<SelectItem key={item.value} value={item.value}>
                    {item.label}
                </SelectItem>))}
            </Select>
            <Input type="date" color="primary" variant="underlined" value={selectedDate}
                   onChange={(e) => setSelectedDate(e.target.value)}/>
            <Select color={"secondary"} variant="underlined" aria-label="gi"
                    onChange={(e) => setSelectedClass(e.target.value)}
                    defaultSelectedKeys={[`${classesOptions[0].value}`]}>
                {classesOptions.map((item) => (<SelectItem key={item.value} value={item.value}>
                    {item.label}
                </SelectItem>))}
            </Select>
            <Select color={"secondary"} variant="underlined"
                    defaultSelectedKeys={[selectedGroups]}
                    aria-label="gi"
                    onChange={(e) => setSelectedGroups(e.target.value)}
            >
                {groups && groups.map((item) => (<SelectItem key={item.value} value={item.value}>
                    {item.label}
                </SelectItem>))}
            </Select>
        </div>
    </div>)
}

export default GetStudentByStatus