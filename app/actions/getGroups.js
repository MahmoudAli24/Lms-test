"use server"
import axios from "axios";

export default async function getGroups() {
    try {
        return  await fetch(`${process.env.NEXT_PUBLIC_URL}/api/groups`,{cache:"no-store"}).then(res => res.json())
    } catch (error) {
        console.log(error);
    }
}
