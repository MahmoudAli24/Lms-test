"use server"
import axios from 'axios'
export async function getExamsNames(group_id) {
    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/exams?group=${group_id}`,)
        if (res.status === 200) {
            return res.data
        } else if (res.status === 404) {
            return null
        }
    } catch (e) {
        console.log(e)
        return null
    }
}

export async function addStudentsExam(data) {
    try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/exams`, data);
        return res.data;
    } catch (e) {
        console.log(e);
        return null;
    }
}