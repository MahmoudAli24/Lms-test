"use client"
import {Input, Button, Card} from '@nextui-org/react';
import {Select, SelectItem} from "@nextui-org/select";
import {useFormState, useFormStatus} from "react-dom";
import {useEffect} from "react";
import {displayToast} from "@/app/ui/displayToast";
import {addUser} from "@/app/actions/userActions";
function SubmitButton() {
    const {pending} = useFormStatus()
    return (<Button type='submit' color='primary' isLoading={pending}>
        Add User
    </Button>)
}
function AddUserPage() {
    const [state, formAction] = useFormState(addUser, null)

    useEffect(() => {
        if (state && state.type === 'success' ) {
            displayToast(state)
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
                >Add User</h1>
                <Input
                    aria-label={"username"}
                    name={"username"}
                    clearable
                    bordered
                    isRequired
                    placeholder="Username"
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
                <Select isRequired
                        name={"role"}
                        aria-label={"role"}
                        placeholder="Select role"
                >
                    <SelectItem key="teacher" value="teacher">Teacher</SelectItem>
                    <SelectItem key="assistant" value="assistant">Assistant</SelectItem>
                </Select>
                <SubmitButton/>
            </form>
        </Card>);
}

export default AddUserPage;
