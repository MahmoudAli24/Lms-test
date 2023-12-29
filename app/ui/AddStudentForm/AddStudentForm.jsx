"use client"
import {useFormState} from 'react-dom'
import {useFormStatus} from 'react-dom'
import {useEffect, useRef, useState} from "react";
import addStudent from "@/app/actions/addStudent";
import {Button, Input} from '@nextui-org/react';
import {Select, SelectItem} from "@nextui-org/select";
import {displayToast} from "@/app/ui/displayToast ";

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
        <div className='flex flex-wrap items-center justify-center gap-3 mb-3'>
            <Input
                className='w-[calc(100%/4-0.15rem)]'
                name='name'
                type='text'
                label='Name'
                placeholder='Enter Student Name'
                isRequired
            />
            <Input
                name='code'
                type='text'
                label='Code'
                placeholder='Enter Student Code'
                className='appearance-none w-[calc(25%-0.15rem)]'
                isRequired
            />
            <Input
                name='phone'
                type='number'
                label='Phone'
                placeholder='Enter Student Phone'
                className='appearance-none w-[calc(25%-0.15rem)]'
                isRequired
            />
            <Select
                label='Class'
                name='class_id'
                placeholder='Select Class'
                className="w-[calc(25%-0.15rem)]"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                isRequired
            >
                {classesOptions && classesOptions.map((item) => (<SelectItem key={item.value} value={item.value}>
                    {item.label}
                </SelectItem>))}
            </Select>
            {selectedClass && (
                <Select
                    label='Group'
                    name='group_id'
                    placeholder='Select Group'
                    className="w-[calc(25%-0.15rem)]"
                    isRequired
                >
                    {groups && groups.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                            {item.label}
                        </SelectItem>
                    ))}
                </Select>
            )}
        </div>
        <SubmitButton/>
    </form
    >);
}
