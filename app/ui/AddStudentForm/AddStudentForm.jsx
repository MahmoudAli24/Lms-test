"use client"
import {useFormState} from 'react-dom'
import {useFormStatus} from 'react-dom'
import {useEffect, useRef, useState} from "react";
import addStudent from "@/app/actions/addStudent";
import {Button, Input} from '@nextui-org/react';
import {Select, SelectItem} from "@nextui-org/select";
import {displayToast} from "@/app/ui/displayToast";

function SubmitButton() {
    const {pending} = useFormStatus()
    return (<Button type='submit' color='primary' isLoading={pending}>
        Add Student
    </Button>)
}

export default function AddStudentForm({classesOptions, groupsOptions}) {
    const formRef = useRef()
    const [state, formAction] = useFormState(addStudent, null)
    const [selectedClass, setSelectedClass] = useState('')
    const groups = groupsOptions && groupsOptions.filter((item) => item.class_id === selectedClass)


    useEffect(() => {
        if (state && state.type === 'success') {
            displayToast(state)
            formRef.current.reset()
        } else if (state && state.type === 'error') {
            displayToast(state)
        }
    }, [state])
    return (<form action={formAction} ref={formRef}>
        <div className="laptop:grid-cols-4 tablet:grid-cols-2 grid-cols-1 grid gap-3 mb-3">
            <Input
                name='name'
                type='text'
                label='Name'
                placeholder='Enter Student Name'
                isRequired
            />
            <Input
                name='phone'
                type='number'
                label='Phone'
                placeholder='Enter Student Phone'
                isRequired
            />
            <Select
                label='Class'
                name='class_id'
                placeholder='Select Class'
                value={selectedClass}
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
                    isRequired
                >
                    {groups && groups.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                            {item.label}
                        </SelectItem>
                    ))}
                </Select>
        </div>
        <SubmitButton/>
    </form
    >);
}
