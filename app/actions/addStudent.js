'use server'
import axios from "axios";
import z from "zod";

export default async function addStudent(prevState, formData) {
    // use ZOD to validate the form data before adding it to the server and then add it to the server again if necessary
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

    try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/students`, data)
        if (res.status === 200) {
            return {message: "Successfully created", type: 'success'}
        } else if (res.status === 404) {
            return {message: "Some Thing Error", type: 'error'}
        }
    } catch (e) {
        console.log(e)
        return {message: "Something went wrong", type: 'error'}
    }
}
