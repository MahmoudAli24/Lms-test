"use client"
import {useEffect, useRef, useState} from "react";
import {useFormState, useFormStatus} from "react-dom";
import {Button, Input} from "@nextui-org/react";
import {addClass} from "@/app/actions/classesActions";
import {displayToast} from "@/app/ui/displayToast ";

function SubmitButton() {
    const {pending} = useFormStatus()
    return (<Button type='submit' color='primary' isLoading={pending}>
        Add Class
    </Button>)
}

function EditClassForm() {
    const formRef = useRef()
    const [state, formAction] = useFormState(addClass, null)
    const [groups, setGroups] = useState([{groupName: ""}]);

    const handleAddGroup = () => {
        setGroups([...groups, {groupName: ""}]);
    };

    const handleRemoveGroup = (index) => {
        const newGroups = [...groups];
        newGroups.splice(index, 1);
        setGroups(newGroups);
    };

    useEffect(() => {
        if (state && state.type === 'success') {
            displayToast(state)
            formRef.current.reset()
        } else if (state && state.type === 'error') {
            displayToast(state)
        }
    }, [state])

    return (
        <form action={formAction} ref={formRef}>
            <Input
                name="className"
                type="text"
                label="Class Name"
                placeholder="Enter Class Name"
                required
            />
            {groups.map((group, index) => (
                <div
                    key={index}
                    className='flex flex-wrap items-center justify-center gap-3 mb-3'
                >
                    <Input
                        className='w-full sm:w-1/2'
                        name={`group-${index}`}
                        type='text'
                        label={`Group ${index + 1}`}
                        placeholder={`Enter Group ${index + 1} Name`}

                    />
                    {index > 0 && (
                        <Button
                            type='button'
                            color='danger'
                            auto
                            onClick={() => handleRemoveGroup(index)}
                        >
                            Remove Group
                        </Button>
                    )}
                </div>
            ))}
            <Button type='button' color='secondary' auto onClick={handleAddGroup}>
                Add Group
            </Button>
            <SubmitButton />
        </form>
    );
}

export default AddClassForm;
