"use client"
import {Input, Button, Card} from '@nextui-org/react';
import {useFormState, useFormStatus} from "react-dom"
import {authenticate} from "@/app/actions/actions";
function LoginPage() {
    const [errorMsg, dispatch] = useFormState(authenticate, undefined)

    return (
        <div
            className="flex items-center justify-center bg-gradient-to-r dark:from-primary-500 dark:to-secondary-600 h-[calc(100vh-65px)] w-full"
        >
            <Card>
                <form
                    action={dispatch}
                    className="flex flex-col items-center justify-center gap-4 w-full p-8 rounded-lg shadow-lg sm:w-96 md:w-96 lg:w-96 xl:w-96 2xl:w-96 bg-opacity-90 "
                >
                    <h1
                        className="text-center text-4xl font-bold text-primary-500 uppercase tracking-wider text-shadow-lg bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-600 leading-10"
                    >Login</h1>
                    <Input
                        clearable
                        bordered
                        fullWidth
                        placeholder="Username"
                        name={"username"}
                    />
                    <Input
                        clearable
                        bordered
                        fullWidth
                        type="password"
                        placeholder="Password"
                        name={"password"}
                    />
                    <LoginButton/>
                    {errorMsg && <p className="text-red-500">{errorMsg}</p>}
                </form>
            </Card>
        </div>
    );
}

export default LoginPage;

function LoginButton() {
    const {pending} = useFormStatus();

    return (
        <Button auto type="submit" color="primary" variant={"shadow"} isLoading={pending}>
            Login
        </Button>
    );
}
