"use client"
import {useFormState, useFormStatus} from "react-dom";
import {Button, Input} from "@nextui-org/react";
import {Select, SelectItem} from "@nextui-org/select";
import {useEffect, useState} from "react";
import {editStudent} from "@/app/actions/studentsActions";
import {displayToast} from "@/app/ui/displayToast ";
import {useRouter} from "next/navigation";

function SubmitButton() {
    const {pending} = useFormStatus()
    return (<Button type='submit' color='primary' isLoading={pending}>
        Edit
    </Button>)
}

export default function EditStudentForm({classesOptions, groupsOptions, studentInfo}) {
    const router = useRouter()
    const [state, formAction] = useFormState(editStudent, null)
    const studentCode = studentInfo.code
    const [selectedClass, setSelectedClass] = useState(`${studentInfo.class_code}`);
    const [selectedGroup, setSelectedGroup] = useState(`${studentInfo.group_code}`);
    const [name, setName] = useState(`${studentInfo.name}`);
    const [code, setCode] = useState(studentCode);
    const [groups, setGroups] = useState([]);
    const groupsOptionsFiltered = groupsOptions.filter((item) => item.class_id === selectedClass)
    useEffect(() => {
        setGroups(groupsOptionsFiltered)
    }, [selectedClass])

    useEffect(() => {
        if (state && state.type === 'success' ) {
            displayToast(state)
            if (state.type === 'success') {
                router.push('/dashboard/students')
            }
        } else if (state && state.type === 'error') {
            displayToast(state)
        }
    }, [state])

    return (
        <form action={formAction}>
            <div className='flex flex-wrap justify-center gap-3 mb-3'>
                <Input
                    className='tablet:w-[calc(100%/2-1.5rem)] laptop:w-[calc(100%/4-1.5rem) '
                    name='name'
                    type='text'
                    label='Name'
                    placeholder='Enter Student Name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    isRequired
                />
                <Input
                    name='code'
                    type='number'
                    label='Code'
                    placeholder='Enter Student Code'
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className='tablet:w-[calc(100%/2-1.5rem)] laptop:w-[calc(100%/4-1.5rem) '
                    isRequired
                />
                <Select
                    label='Class'
                    name='class_id'
                    placeholder='Select Class'
                    className="tablet:w-[calc(100%/2-1.5rem)] laptop:w-[calc(100%/4-1.5rem) "
                    selectedKeys={[selectedClass]}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    isRequired
                >
                    {classesOptions && classesOptions.map((item) => (<SelectItem key={item.value} value={item.value}>
                        {item.label}
                    </SelectItem>))}
                </Select>

                <Select
                    label='Group'
                    name='group_id'
                    placeholder='Select Group'
                    className="tablet:w-[calc(100%/2-1.5rem)] laptop:w-[calc(100%/4-1.5rem) "
                    selectedKeys={[selectedGroup]}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                    isRequired
                >
                    {groups.map((item) => (<SelectItem key={item.value} value={item.value}>
                        {item.label}
                    </SelectItem>))}
                </Select>
            </div>
            <SubmitButton/>
        </form>
    )
}