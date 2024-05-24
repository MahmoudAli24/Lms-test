"use server"
import axios from 'axios'
import {revalidatePath} from "next/cache";

export async function getExamsNames(group_id) {
    try {
        return await fetch(`${process.env.NEXT_PUBLIC_URL}/api/exams?group_id=${group_id}`, {cache: "no-store"}).then(res => res.json())
    } catch (e) {
        console.log(e)
        return null
    }
}

export async function getExamsNamesForAll() {
    try {
        return  await fetch(`${process.env.NEXT_PUBLIC_URL}/api/exams?all=true`, {cache: "no-store"}).then(res => res.json())
    } catch (e) {
        console.log(e)
        return null
    }
}


export async function addStudentsExam(data) {
    try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/exams`, data);
        revalidatePath("/api/exams?all=1")
        return res.data;
    } catch (e) {
        console.log(e);
        return null;
    }
}

export async function getExams(group_id, date, examName) {
    try {
        return  await fetch(`${process.env.NEXT_PUBLIC_URL}/api/exams?group_id=${group_id}&date=${date}&examName=${examName}`, {cache: "no-store"}).then(res => res.json())
    } catch (e) {
        console.log(e)
        return null
    }
}

export async function updateStudentsExam(data) {
    try {
        const res = await axios.patch(`${process.env.NEXT_PUBLIC_URL}/api/exams`, data);
        return res.data;
    } catch (e) {
        console.log(e);
        return null;
    }
}