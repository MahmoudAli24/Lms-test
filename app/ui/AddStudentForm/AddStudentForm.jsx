import addStudent from "@/app/actions/addStudent";
import { Button, Input } from "@nextui-org/react";

export default function AddStudentForm() {
  async function addStudentData(formData) {
    "use server";
    await addStudent(formData );
  }
  return (
    <form action={addStudentData}>
      <Input
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
      />
      <Input
        name='class_code'
        type='number'
        label='Class Code'
        placeholder='Enter Student Class Code'
      />
      <Input
        name='group_code'
        type='number'
        label='Group Code'
        placeholder='Enter Student Group Code'
      />
      <Button type='submit' color='primary' auto>
        Add Student
      </Button>
    </form>
  );
}
