"use server"
import axios from "axios";
import {revalidatePath} from "next/cache";
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

export async function getGroups() {
    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/groups`);
        if (res.status === 200) {
            return res.data
        }
    } catch (e) {
        console.log(e)
    }
}

// Delete group

export async function deleteGroup(selectedGroupData) {
    const {_id} = selectedGroupData
    try {
        const res = await axios.delete(`${process.env.NEXT_PUBLIC_URL}/api/groups/${_id}`);
        if (res.status === 200) {
            revalidatePath(`/dashboard/classes/${_id}`)
            return res.status
        } else {
            return {error: res.data}
        }
    } catch (e) {
        console.log(e)
    }
}

// Get group

export async function getGroup(id) {
    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/groups/${id}`);
        if (res.status === 200) {
            return res.data
        }
    } catch (e) {
        console.log(e)
    }
}