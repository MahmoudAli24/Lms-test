"use server"
import axios from "axios";
import {revalidatePath} from "next/cache";
export async function getGroupsOptions() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/groups` ,{cache:'no-store'});
        const {groups} = await res.json()
            return groups.map(({_id, groupName, class_id}) => ({value: _id, label: groupName, class_id}))
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
       return await fetch(`${process.env.NEXT_PUBLIC_URL}/api/groups/${id}`,{cache:'no-store'}).then(res => res.json())
    } catch (e) {
        console.log(e)
    }
}