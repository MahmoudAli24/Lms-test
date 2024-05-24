"use client"
import {useEffect, useRef, useState} from "react";
import {useFormState, useFormStatus} from "react-dom";
import {Button, Input} from "@nextui-org/react";
import {addClass} from "@/app/actions/classesActions";
import {displayToast} from "@/app/ui/displayToast";

function SubmitButton() {
    const {pending} = useFormStatus()
    return (<Button type='submit' color='primary' isLoading={pending}>
        Add Class
    </Button>)
}

function AddClassForm() {
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
            <div
                className="grid tablet:grid-cols-2 grid-cols-1 gap-3"
            >
                <div>
                    <Input
                        name="className"
                        type="text"
                        label="Class Name"
                        placeholder="Enter Class Name"
                        isRequired
                    />
                </div>
                <div>
                    {groups.map((group, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-center space-x-3"
                        >
                            <Input
                                name={`group-${index}`}
                                type='text'
                                label={`Group ${index + 1}`}
                                placeholder={`Enter Group ${index + 1} Name`}
                                isRequired
                                className="mb-3"
                            />
                            {index > 0 && (
                                <Button
                                    type='button'
                                    color='danger'
                                    auto
                                    onClick={() => handleRemoveGroup(index)}
                                >
                                    Delete
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <Button className="mr-2" type='button' color='secondary' auto onClick={handleAddGroup}>
                Add Group
            </Button>
            <SubmitButton/>
        </form>
    );
}

export default AddClassForm;
