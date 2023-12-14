"use server"
import axios from "axios";
import z from "zod";

export async function addClass(formData) {
    const schema = z.object({
        name: z.string().min(2, {message: "Must be 2 or more characters long"}).max(20, {message: "Must be 20 or less characters long"}),
        group_id: z.string(),
    });
    const parse = schema.safeParse({
        name: formData.get('name'),
        group_id: formData.get('group_id'),
    })
    const data = parse.data
    try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/classes`, data);
        if (res.status === 200) {
            return {message: "Successfully created", type: 'success'}
        } else if (res.status === 404) {
            return {message: "Group not found", type: 'error'}
        }
    } catch (e) {
        console.log(e)
    }
}

export async function getClasses() {
    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/classes`);
        if (res.status === 200) {
            return res.data
        }
    } catch (e) {
        console.log(e)
    }
}

export async function getGroupsOptions() {
    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/groups`);
        if (res.status === 200) {
            const {groups} = res.data
            return groups.map(({_id, groupName, class_id}) => ({value: _id, label: groupName, class_id}))
        }
    } catch (e) {
        console.log(e)
    }
}