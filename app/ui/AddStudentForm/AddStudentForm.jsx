"use client"
import addStudent from '@/app/actions/addStudent';
import { useFormState } from 'react-dom'
import { useFormStatus } from 'react-dom'
import { useEffect, useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/select";

import { toast } from 'react-toastify';


const initialState = {
  message: null,
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type='submit' color='primary' aria-disabled={pending}>
      Add Student
    </Button>
  )
}

export default function AddStudentForm({ classOptions, groups }) {
  const [state, formAction] = useFormState(addStudent, initialState)
  const [selectedClass, setSelectedClass] = useState("");
  const [groupsSelected, setGroupsSelected] = useState([]);
  const [groupsOptions, setGroupsOptions] = useState([]);

  useEffect(() => {
    if (Array.isArray(groups)) {
      const selectedGroups = groups.filter((group) => group.class_id === selectedClass);
      setGroupsSelected(selectedGroups);
    } else {
      setGroupsSelected([]);
    }
  }, [selectedClass, groups]);


  useEffect(() => {
    const groupsOption = groupsSelected.map((group) => {
      return { label: group.groupName, value: group._id };
    });
    setGroupsOptions(groupsOption);
  }, [groupsSelected]);

  if (state.message === "Student Added Successfully") {
    toast.success(state.message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    })
  } else if (state.message === "Error Adding Student") {
    toast.error(state.message , {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    })
  }

  return (
    <form action={formAction}>
      <div className='flex flex-wrap items-center justify-center gap-3 mb-3'>
        <Input
          className='w-[calc(100%/4-0.15rem)]'
          name='name'
          type='text'
          label='Name'
          placeholder='Enter Student Name'
        />
        <Input
          name='code'
          type='number'
          label='Code'
          placeholder='Enter Student Code'
          className='appearance-none w-[calc(25%-0.15rem)]'
        />
        <Select
          name="class_code"
          label="Class"
          onChange={(e) => setSelectedClass(e.target.value)}
          value={selectedClass}
          placeholder="Select an Class"
          className="w-[calc(25%-0.15rem)]"
        >
          {
            classOptions && classOptions.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))
          }
        </Select>
        <Select
          name="group_code"
          label="Select Group"
          placeholder="Select a group"
          className="w-[calc(25%-0.15rem)]"
        >
          {
            groupsOptions.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))
          }
        </Select>
      </div>
      <SubmitButton />
    </form>
  );
}
