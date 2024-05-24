"use server";
import z from "zod";
import axios from "axios";

export async function addUser(prevState, formData){
    try {
        const schema = z.object({
            username: z.string(), password: z.string(), role: z.string(),
        });
        const parse = schema.safeParse({
            username: formData.get('username'),
            password: formData.get('password'),
            role: formData.get('role'),
        })
        const data = parse.data
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if (res.status === 201) {
            return {message: "Successfully created", type: 'success'}
        } else if (res.status === 400) {
            return {message: "User already exists", type: 'error'}
        }

    } catch (e) {
        console.log(e)
    }
}

export async function getUsers(){
    try {
        return  await fetch(`${process.env.NEXT_PUBLIC_URL}/api/userauth` ,{cache:"no-store"}).then(res => res.json())
    } catch (e) {
        console.log(e)
    }
}

export async function deleteUser(id){
    try {
        const res = await axios.delete(`${process.env.NEXT_PUBLIC_URL}/api/userauth/${id}`)
        if (res.status === 200) {
            return {message: "Successfully deleted", type: 'success'}
        } else {
            return {message: "Failed to delete", type: 'error'}
        }
    } catch (e) {
        console.log(e)
    }
}

export async function updateUser(prevState, formData){
    try {
        const schema = z.object({
            username: z.string(), role: z.string(),
            password: z.string(),
            id: z.string()
        });
        const parse = schema.safeParse({
            username: formData.get('username'),
            role: formData.get('role'),
            password: formData.get('password'),
            id: formData.get('id')
        })
        const data = parse.data
        const res = await axios.patch(`${process.env.NEXT_PUBLIC_URL}/api/userauth/${data.id}`, data)
        if (res.status === 200) {
            return {message: "Successfully updated", type: 'success'}
        } else {
            return {message: "Failed to update", type: 'error'}
        }
    } catch (e) {
        console.log(e)
    }
}

export async function getUser(id){
    try {
        return await fetch(`${process.env.NEXT_PUBLIC_URL}/api/userauth/${id}` ,{cache:"no-store"}).then(res => res.json())
    } catch (e) {
        console.log(e)
    }
}