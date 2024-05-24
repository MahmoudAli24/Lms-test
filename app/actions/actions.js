"use server"
import {signIn, signOut} from "@/auth";
import {AuthError} from "@auth/core/errors";


export async function authenticate(prevState, formData) {
    try {
        await signIn("credentials", formData , {redirect: false});
        return undefined
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}

export async function logout() {
    try {
        await signOut({redirect: false});
    } catch (error) {
        console.log('Error:', error);
    }
}