'use server'
import axios from "axios";
import z from "zod";

export default async function addStudent(prevState, formData) {
    // use ZOD to validate the form data before adding it to the server and then add it to the server again if necessary
    const schema = z.object({
        name: z.string(),
        code: z.number(),
        phone: z.string(),
        class_id: z.string(),
        group_id: z.string(),
    });
    const parse = schema.safeParse({
        name: formData.get('name'),
        code: +formData.get('code'),
        phone: formData.get('phone'),
        class_id: formData.get('class_id'),
        group_id: formData.get('group_id'),
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
