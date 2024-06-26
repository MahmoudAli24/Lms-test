"use server";
import axios from "axios";
import z from "zod";

// Edit Student data
export async function editStudent(prevState, formData) {
    const schema = z.object({
        name: z.string(), code: z.number(), class_id: z.string(), group_id: z.string(),
    });
    const parse = schema.safeParse({
        name: formData.get('name'),
        code: +formData.get('code'),
        class_id: formData.get('class_id'),
        group_id: formData.get('group_id'),
    })
    const data = parse.data
    try {
        const res = await axios.patch(`${process.env.NEXT_PUBLIC_URL}/api/students/${data.code}`, data)
        if (res.status === 200) {
            return {message: "Successfully updated", type: 'success'}
        } else if (res.status === 404) {
            return {message: "Some Thing Error", type: 'error'}
        }
    } catch (e) {
        console.log(e)
        return {message: "Something went wrong", type: 'error'}
    }

}

// Delete Student
export async function deleteStudent(code) {
    try {
        const res = await axios.delete(`${process.env.NEXT_PUBLIC_URL}/api/students/${code}`)
        if (res.status === 200) {
            return {message: "Successfully deleted", type: 'success'}
        } else if (res.status === 404) {
            return {message: "Some Thing Error", type: 'error'}
        }
    } catch (e) {
        console.log(e)
        return {message: "Something went wrong", type: 'error'}
    }
}

// Get Students
export async function getStudents(fields, group_id) {
    try {
        return await fetch(`${process.env.NEXT_PUBLIC_URL}/api/students?${fields ? `fields=${fields}` : ''}${group_id ? `&group_id=${group_id}` : ''}`, {cache:"no-store"}).then(res => res.json())
    } catch (e) {
        console.log(e)
    }
}

export async function getStudentsPagination(fields, page, rowsPerPage, name) {
    try {
        return await fetch(`${process.env.NEXT_PUBLIC_URL}/api/students?${fields ? `fields=${fields}` : ''}&page=${page}&rowsPerPage=${rowsPerPage}&name=${name}`, {cache:"no-store"})
            .then(res => res.json())
    } catch (e) {
        console.log(e)
    }
}

export async function getAbsentsStudents(absentDays, group_id, status, page, rowsPerPage) {
    try {
        return  await fetch(`${process.env.NEXT_PUBLIC_URL}/api/attendance?group_id=${group_id}&status=${status}&absentDays=${absentDays}&page=${page}&rowsPerPage=${rowsPerPage}`).then(res => res.json())
    } catch (e) {
        console.log(e)
    }
}

export async function getVocAndHomeworkReport(group_id, date_report, voc_status, homework_status, page, rowsPerPage) {
    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/report-vh`,
            {
                params: {
                    group_id,
                    date_report,
                    voc_status,
                    homework_status,
                    page,
                    rowsPerPage
                }
            });
        return res.data;
    } catch (e) {
        console.log(e);
        return null;
    }
}
