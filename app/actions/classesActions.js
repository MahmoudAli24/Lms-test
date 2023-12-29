"use server"
import axios from "axios";
import z from "zod";

export async function addClass(prevState,formData) {
        const groups = [];
    for (const pair of formData.entries()) {
        if (pair[0] !== 'className') {
            groups.push({groupName: pair[1]})
        }
    }
    const data = {
        className: formData.get('className'),
        groups
    }

    console.log("groups", groups)

    const schema = z.object({
        className: z.string(),
        groups: z.array(z.object({
            groupName: z.string()
        }))
    })

    const parse = schema.safeParse(data)

    const dataParsed = parse.data

    if (!parse.success) {
        return {message: "Something went wrong", type: 'error'}
    } else {
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/classes`, dataParsed);
            if (res.status === 200) {
                return {message: "Successfully created", type: 'success'}
            } else if (res.status === 404) {
                return {message: "Group not found", type: 'error'}
            }
        } catch (e) {
            console.log(e)
        }
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

export async function getClassesOptions() {
    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/classes`);
        if (res.status === 200) {
            const {classes} = res.data
            return classes.map(({_id, className}) => ({value: _id, label: className}))
        }
    } catch (e) {
        console.log(e)
    }
}

export async function getClass(id) {
    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/classes/${id}`);
        if (res.status === 200) {
            return res.data
        }
    } catch (e) {
        console.log(e)
    }
}

// Edit class
export async function editClass(prevState, data) {
    const id = data._id

    const schema = z.object({
        _id: z.string(),
        className: z.string(),
        groups: z.array(z.object({
            groupName: z.string(),
            _id: z.string().optional(),
            class_id: z.string().optional()
        }))
    })

    const parse = schema.safeParse({
        _id: id,
        className: data.className,
        groups: data.groups

    })

    const dataParsed = parse.data

    if (!parse.success) {
        return {message: "Something went wrong", type: 'error'}
    } else {
        try {
            const res = await axios.patch(`${process.env.NEXT_PUBLIC_URL}/api/classes/${id}`, dataParsed);
            if (res.status === 200) {
                return {message: "Successfully updated", type: 'success'}
            } else if (res.status === 404) {
                return {message: "Group not found", type: 'error'}
            }
        } catch (e) {
            console.log(e)
        }
    }
}