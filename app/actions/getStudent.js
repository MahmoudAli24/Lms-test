"use server"
import axios from "axios";

export default async function getStudent(code,fields) {
    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/students/${code}?fields=${fields}`);
        return res.data
    } catch (error) {
        console.log(error);
    }
}