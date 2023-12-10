"use client"
import { useState } from "react";
import { Button, Input } from "@nextui-org/react";
import axios from "axios";

function AddClassForm() {
  const [groups, setGroups] = useState([{ groupName: "" }]);
  const [className, setClassName] = useState('');

  const handleInputChange = (index, event) => {
    const newGroups = [...groups];
    newGroups[index].groupName = event.target.value;
    setGroups(newGroups);
  };

  const handleAddGroup = () => {
    setGroups([...groups, { groupName: "" }]);
  };

  const handleRemoveGroup = (index) => {
    const newGroups = [...groups];
    newGroups.splice(index, 1);
    setGroups(newGroups);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Your form submission logic here using the 'groups' state
    // get form data  and send to server
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    const { className } = data;
    const classData = {
      className,
      groups,
    };
    console.log("classData=>", classData);
    console.log("groups=>", groups);
    try {
      const res = await axios.post("https://lms-test-pi.vercel.app/api/classes", classData);
      console.log("res=>", res);
      if (res.status === 200) {
        setGroups([{ name: '' }]);
        setClassName('');
      }
    } catch (error) {
      console.log("error=>", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        name="className"
        type="text"
        label="Class Name"
        placeholder="Enter Class Name"
        value={className}
        onChange={(event) => setClassName(event.target.value)}
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
            value={group.name}
            onChange={(e) => handleInputChange(index, e)}
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
      <Button type='submit' color='primary' auto>
        Add Class
      </Button>
    </form>
  );
}

export default AddClassForm;
