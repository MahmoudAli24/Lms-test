"use server"
import axios from "axios";
import {revalidatePath} from "next/cache";

export async function addAttendance(attendanceData) {
    try {
        const {data} = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/attendance`, attendanceData);
        revalidatePath("/api/students");
        revalidatePath('/dashboard/attendance');
        return data;
    } catch (error) {
        console.error("Error adding attendance:", error);
        return {message: "Internal Server Error"};
    }
}

export async function getAttendanceByDate(group, date) {
    try {
        const {data} = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/attendance?group_id=${group}&date=${date}`);
        const {attendance, vocabulary, homework} = data;
        const combinedData = [
            ...attendance.map((entry) => ({code: entry.student.code, attendance: entry.status , name: entry.student.name})),
            ...vocabulary.map((entry) => ({code: entry.student.code, vocabulary: entry.status , name: entry.student.name})),
            ...homework.map((entry) => ({code: entry.student.code, homework: entry.status , name: entry.student.name}))
        ];
        let groupedData;
        groupedData = combinedData.reduce((acc, entry) => {
            const existingEntry = acc.find((item) => item.code === entry.code);

            if (existingEntry) {
                existingEntry.attendance = existingEntry.attendance || entry.attendance;
                existingEntry.vocabulary = existingEntry.vocabulary || entry.vocabulary;
                existingEntry.homework = existingEntry.homework || entry.homework;
            } else {
                acc.push(entry);
            }

            return acc;
        }, []);
        return groupedData;
    } catch (error) {
        console.error("Error getting attendance:", error);
        return {message: "Internal Server Error"};
    }
}

export async function updateAttendance(data) {
    try {
        const {data: response} = await axios.patch(`${process.env.NEXT_PUBLIC_URL}/api/attendance`, data);
        revalidatePath("/api/students");
        revalidatePath('/dashboard/attendance');
        return response;
    } catch (error) {
        console.error("Error updating attendance:", error);
        return {message: "Internal Server Error"};
    }
}