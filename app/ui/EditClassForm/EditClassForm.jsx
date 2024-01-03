"use client"
import {useEffect, useState} from "react";
import {useFormState, useFormStatus} from "react-dom";
import {Button, Input, useDisclosure} from "@nextui-org/react";
import {editClass} from "@/app/actions/classesActions";
import {displayToast} from "@/app/ui/displayToast";
import RemoveGroupModal from "@/app/ui/RemoveGroupModal";
import {deleteGroup} from "@/app/actions/groupsActions";

function SubmitButton() {
    const {pending} = useFormStatus()
    return (<Button type='submit' color='primary' isLoading={pending}>
        Edit Class
    </Button>)
}

function EditClassForm({classData}) {
    const [selectedClass, setSelectedClass] = useState(`${classData.className}`);
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [groups, setGroups] = useState(classData.groups);
    const [state, formAction] = useFormState(editClass, null);
    const [selectedGroup, setSelectedGroup] = useState(null);

    const newClassData = {
        ...classData, className: selectedClass, groups: groups,
    }

    const handleAddGroup = () => {
        setGroups([...groups, {groupName: ""}]);
    };

    const handleRemoveGroup = (index) => {
        setSelectedGroup(index)
        onOpen()
    };

    const handleDeleteConfirm = async () => {
        try {
            const newGroups = [...groups]
            newGroups.splice(selectedGroup, 1)
            setGroups(newGroups)
            const selectedGroupData = groups[selectedGroup]
            console.log("selectedGroupData", selectedGroupData)
            const req= await deleteGroup(selectedGroupData)
            console.log(req)
            onOpenChange()
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        if (state && state.type === 'success') {
            displayToast(state)

        } else if (state && state.type === 'error') {
            displayToast(state)
        }
    }, [state])

    return (<form onSubmit={(e) => {
        e.preventDefault();
        formAction(newClassData)
    }}>
        <Input
            name="className"
            type="text"
            label="Class Name"
            placeholder="Enter Class Name"
            required
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
        />
        {groups.map((group, index) => (<div
            key={index}
            className='flex flex-wrap items-center justify-center gap-3 mb-3'
        >
            <Input
                className='w-full sm:w-1/2'
                name={`group-${index}`}
                type='text'
                label={`Group ${index + 1}`}
                placeholder={`Enter Group ${index + 1} Name`}
                value={group.groupName}
                onChange={(e) => {
                    const newGroups = [...groups];
                    newGroups[index].groupName = e.target.value;
                    setGroups(newGroups);
                }}
                required

            />
            {index > 0 && (<Button
                type='button'
                color='danger'
                auto
                onClick={() => handleRemoveGroup(index)}
            >
                Remove Group
            </Button>)}
        </div>))}
        <Button type='button' color='secondary' auto onClick={handleAddGroup}>
            Add Group
        </Button>
        <SubmitButton/>

        {isOpen && (<RemoveGroupModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        handleDeleteConfirm={handleDeleteConfirm}
        />)}

    </form>);
}

export default EditClassForm;
