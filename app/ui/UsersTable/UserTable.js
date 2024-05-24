"use client"
import {useCallback, useEffect, useMemo, useState} from "react";
import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Spinner,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Tooltip,
    useDisclosure
} from "@nextui-org/react";
import {deleteUser, getUsers} from "@/app/actions/userActions";
import Link from "next/link";
import {EditIcon} from "@/app/ui/Icons/EditIcon";
import {DeleteIcon} from "@/app/ui/Icons/DeleteIcon";
import {displayToast} from "@/app/ui/displayToast";

export default function UserTable() {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [usersData, setUsersData] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null);
    const columns = useMemo(() => {
        return [{name: 'username', uid: 'Username'}, {name: 'role', uid: 'Role'}, {name: 'actions', uid: 'Actions'}]
    }, [])
    const fetchUsers = async () => {
        setIsLoading(true)
        const users = await getUsers()
        setUsersData(users)
        setIsLoading(false)
    }
    useEffect(() => {
        fetchUsers()
    }, [])

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const handleDeleteClick = useCallback((selectedUser) => {
        setSelectedUser(selectedUser);
        onOpen();
    }, [setSelectedUser, onOpen]);

    const handleDeleteConfirm = async () => {
        try {
            setIsLoading(true)
            const req = await deleteUser(selectedUser._id);
            if (req.type === 'success') {
                displayToast(req)
                onOpenChange();
                setIsLoading(false)
                await fetchUsers()
            } else {
                displayToast(req)
                setIsLoading(false)
            }
        } catch (e) {
            console.log(e);
        }
    };


    return (<div>
        <Table aria-label="User Table">
            <TableHeader
                columns={columns}
            >
                {(column) => (<TableColumn
                    key={column.uid}
                >
                    {capitalize(column.name)}
                </TableColumn>)}
            </TableHeader>
            <TableBody
                items={usersData ? usersData : []}
                loadingContent={<Spinner/>}
                loadingState={isLoading ? "loading" : "idle"}
                emptyContent={"No rows to display."}
            >
                {(item) => (<TableRow
                    key={item.username}
                >
                    <TableCell>{item.username}</TableCell>
                    <TableCell>{item.role}</TableCell>
                    <TableCell>
                        <div className='relative flex items-center gap-2'>
                            <Tooltip content='Edit User'>
                                <Link
                                    href={`/dashboard/editUser/${item._id}/edit`}
                                    className='text-lg text-default-400 cursor-pointer active:opacity-50'>
                                    <EditIcon/>
                                </Link>
                            </Tooltip>
                            <Tooltip color='danger' content='Delete User'>
                        <span className="text-lg text-danger cursor-pointer active:opacity-50"
                              onClick={() => handleDeleteClick(item)}
                        >
                        <DeleteIcon/>
                        </span>
                            </Tooltip>
                        </div>
                    </TableCell>
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
                        <p>
                            Are you sure you want to delete <span
                            className="font-bold text-danger">{selectedUser.username}</span> ?
                        </p>
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
    </div>);
}