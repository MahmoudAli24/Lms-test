"use client"
import {useFormState, useFormStatus} from "react-dom";
import {useEffect, useState} from "react";
import {Button, Card, Input} from "@nextui-org/react";
import {Select, SelectItem} from "@nextui-org/select";
import {displayToast} from "@/app/ui/displayToast";
import {updateUser} from "@/app/actions/userActions";
import {useRouter} from "next/navigation";


function SubmitButton() {
    const {pending} = useFormStatus()
    return (<Button type='submit' color='primary' isLoading={pending}>
        Edit User
    </Button>)
}

export default function EditUserForm({user}) {
    const [state, formAction] = useFormState(updateUser, null)
    const [userData, setUserData] = useState([])
    const [username, setUsername] = useState(null)
    const [role, setRole] = useState(null)
    const router = useRouter()

    useEffect(() => {
        if (userData) {
            setUsername(userData.username)
            setRole(userData.role)
        }
    }, [userData])

    useEffect(() => {
        if (user) {
            setUserData(user)
        }
    }, [user]);

    useEffect(() => {
        if (state && state.type === 'success') {
            displayToast(state)
            router.push('/dashboard/users')
        } else if (state && state.type === 'error') {
            displayToast(state)
        }
    }, [state])

    return (

        <Card>
            <form action={formAction}
                  className="flex flex-col items-center justify-center gap-4 w-full p-8 rounded-lg shadow-lg sm:w-96 md:w-96 lg:w-96 xl:w-96 2xl:w-96 bg-opacity-90 "
            >
                <h1
                    className="text-center text-4xl font-bold text-primary-500 uppercase tracking-wider text-shadow-lg bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-600 leading-10"
                >Edit User</h1>
                <Input
                    aria-label={"username"}
                    name={"username"}
                    clearable
                    bordered
                    isRequired
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <Input
                    aria-label={"password"}
                    name={"password"}
                    clearable
                    bordered
                    type="password"
                    placeholder="Password"
                    isRequired

                />
                <Input
                    name={"id"}
                    type="hidden"
                    value={userData._id}
                    className="hidden"
                />
                <Select isRequired
                        name={"role"}
                        aria-label={"role"}
                        placeholder="Select role"
                        selectedKeys={[role]}
                        onChange={(e) => setRole(e.target.value)}
                >
                    <SelectItem key="teacher" value="teacher">Teacher</SelectItem>
                    <SelectItem key="assistant" value="assistant">Assistant</SelectItem>
                </Select>
                <SubmitButton/>
            </form>
        </Card>);
}