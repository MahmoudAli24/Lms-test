"use client";
import {
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Tooltip,
    useDisclosure
} from "@nextui-org/react";
import {useCallback, useEffect, useState} from "react";
import {EyeIcon} from "@/app/ui/Icons/EyeIcon";
import {EditIcon} from "@/app/ui/Icons/EditIcon";
import {DeleteIcon} from "@/app/ui/Icons/DeleteIcon";
import Link from "next/link";
import RemoveGroupModal from "@/app/ui/RemoveGroupModal";
import {deleteGroup} from "@/app/actions/groupsActions";
import {displayToast} from "@/app/ui/displayToast";

export default function GroupTable({groups}) {
    const [selectedGroup, setSelectedGroup] = useState(null);
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [groupsData, setGroupsData] = useState(groups||[]);

    const columns = [{name: "Name", uid: "groupName"}, {name: "Number of students", uid: "students_ids"} , {name: "Actions", uid: "actions"}];
    const renderCell = useCallback((item, columnKey) => {
        const cellValue = groupsData[columnKey];
        if (columnKey === "actions") {
            return (<div className='relative flex items-center gap-2'>
                <Tooltip content='Details'>
                    <Link
                        href={`/dashboard/groups/${item._id}`}
                        className='text-lg text-default-400 cursor-pointer active:opacity-50 bg-transparent'
                    >
                        <EyeIcon/>
                    </Link>
                </Tooltip>
                <Tooltip content='Edit Group'>
                    <Link
                        href={`/dashboard/classes/${item.classID}/edit`}
                        className='text-lg text-default-400 cursor-pointer active:opacity-50'>
                        <EditIcon/>
                    </Link>
                </Tooltip>
                <Tooltip color='danger' content='Delete Group'>
                        <span className="text-lg text-danger cursor-pointer active:opacity-50"
                              onClick={() => handleDeleteClick(item)}>
                        <DeleteIcon/>
                        </span>
                </Tooltip>
            </div>);
        } else if (columnKey === "groupName") {
            return <span>{item.groupName}</span>;
        } else if (columnKey === "students_ids") {
            return <span>{item.student_ids.length}</span>;
        } else{
            return cellValue;
        }
    }, [ groups]);

    const handleDeleteClick = (item) => {
        setSelectedGroup(item)
        onOpen()
    };

    useEffect(() => {
        if (groupsData.length === 0) {
            return <div className='flex justify-center items-center h-80'>
                <h1 className='text-2xl text-default-500'>No groups found</h1>
            </div>
        } else if (groups === null) {
            return <div className='flex justify-center items-center h-80'>
                <h1 className='text-2xl text-default-500'>Loading...</h1>
            </div>
        } else if (groups.length > 0) {
            setGroupsData(groups)
        }

    }, [groups , groupsData]);
    const handleDeleteConfirm = async () => {
        try {
            const req= await deleteGroup(selectedGroup)
            console.log(req)
            if (req=== 200) {
                displayToast({type: "success", message: "Group deleted successfully"})
            } else {
                displayToast({type: "error", message: "Failed to delete group"})
            }
            onOpenChange()
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <>
            <Table >
                <TableHeader columns={columns}>
                    {(column) => (<TableColumn
                        key={column.uid}
                        align={column.uid === "actions" ? "center" : "left"}
                    >
                        {column.name}
                    </TableColumn>)}
                </TableHeader>
                <TableBody items={groupsData}>
                    {(item) => (
                        <TableRow key={item._id}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {isOpen && (<RemoveGroupModal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                handleDeleteConfirm={handleDeleteConfirm}
            />)}
        </>

    )
}