"use client"
import {
    Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip, useDisclosure
} from "@nextui-org/react";
import Link from "next/link";
import {EyeIcon} from "@/app/ui/Icons/EyeIcon";
import {EditIcon} from "@/app/ui/Icons/EditIcon";
import {DeleteIcon} from "@/app/ui/Icons/DeleteIcon";
import {useCallback, useState} from "react";
import {deleteGroup} from "@/app/actions/groupsActions";
import {displayToast} from "@/app/ui/displayToast";
import RemoveGroupModal from "@/app/ui/RemoveGroupModal";
import {calculateAttendancePercentage} from "@/app/functions/attendanceAnalysis";

export default function StudentsGroupTable({student_ids}) {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [selectedGroup, setSelectedGroup] = useState(null);
    const columns = [{name: "CODE", uid: "code"}, {name: "NAME", uid: "name"}, {name: "ATTENDANCE RATE", uid: "attendanceRate"}, {
        name: "ACTIONS",
        uid: "actions"
    }]

    const individualAttendanceRates = student_ids.map((student) => {
        const attendanceRate = calculateAttendancePercentage(student)
        return {
            attendanceRate: isNaN(attendanceRate) ? "0.00%" : attendanceRate + "%",
        };
    });

    const students = student_ids.map((student, index) => {
        return {
            ...student,
            ...individualAttendanceRates[index],
        };
    })

    const renderCell = useCallback((item, columnKey) => {
        const cellValue = students[columnKey];
        if (columnKey === "actions") {
            return (<div className='relative flex items-center gap-2'>
                <Tooltip content='Details' aria-label="View Student">
                    <Link
                        href={`/dashboard/students/${item.code}`}
                        className='text-lg text-default-400 cursor-pointer active:opacity-50 bg-transparent'
                    >
                        <EyeIcon/>
                    </Link>
                </Tooltip>
                <Tooltip content='Edit Student' aria-label="Edit Student">
                    <Link
                        href={`/dashboard/students/${item.code}/edit`}
                        className='text-lg text-default-400 cursor-pointer active:opacity-50'>
                        <EditIcon/>
                    </Link>
                </Tooltip>
                <Tooltip color='danger' content='Delete Student' aria-label="Delete Student">
                        <span className="text-lg text-danger cursor-pointer active:opacity-50"
                              onClick={() => handleDeleteClick(item)}>
                        <DeleteIcon/>
                        </span>
                </Tooltip>
            </div>);
        } else if (columnKey === "name") {
            return <span>{item.name}</span>;
        } else if (columnKey === "code") {
            return <span>{item.code}</span>;
        } else if (columnKey === "attendanceRate") {
            return <span className="text-blue-400">{item.attendanceRate}</span>;
        }
        else {
            return cellValue;
        }
    }, [student_ids]);
    const handleDeleteClick = (item) => {
        setSelectedGroup(item)
        onOpen()
    };

    const handleDeleteConfirm = async () => {
        try {
            const req = await deleteGroup(selectedGroup)
            console.log(req)
            if (req === 200) {
                displayToast({type: "success", message: "Group deleted successfully"})
            } else {
                displayToast({type: "error", message: "Failed to delete group"})
            }
            onOpenChange()
        } catch (e) {
            console.log(e);
        }
    }

    return (<div>
        <>
            <Table aria-label="Example table with dynamic content">
                <TableHeader columns={columns}>
                    {(column) => (<TableColumn
                        key={column.uid}
                        align={column.uid === "actions" ? "center" : "left"}
                    >
                        {column.name}
                    </TableColumn>)}
                </TableHeader>
                <TableBody items={students} emptyContent="No Students">
                    {(item) => (<TableRow key={item.code}>
                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                    </TableRow>)}
                </TableBody>
            </Table>
            {isOpen && (<RemoveGroupModal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                handleDeleteConfirm={handleDeleteConfirm}
            />)}

        </>
    </div>)
}