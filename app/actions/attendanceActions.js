"use server"
import axios  from "axios";
import {revalidatePath} from "next/cache";
export async function addAttendance(attendanceData) {
    try {
        const {data} = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/attendance`, attendanceData);
        revalidatePath("/api/students");
        return data;
    } catch (error) {
        console.error("Error adding attendance:", error);
        return {message: "Internal Server Error"};
    }
}