"use server";
import axios  from "axios";
import z from "zod";
// Edit Student data
export async function editStudent(prevState , formData) {
    const schema = z.object({
        name: z.string(),
        code: z.number(),
        class_code: z.string(),
        group_code: z.string(),
    });
    const parse = schema.safeParse({
        name: formData.get('name'),
        code: +formData.get('code'),
        class_code: formData.get('class_id'),
        group_code: formData.get('group_id'),
    })
    const data = parse.data
    console.log("data" , data)
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