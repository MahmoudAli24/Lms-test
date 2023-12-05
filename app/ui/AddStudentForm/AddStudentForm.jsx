import addStudent from "@/app/actions/addStudent";
import { Button, Input } from "@nextui-org/react";

export default function AddStudentForm() {
  async function addStudentData(formData) {
    "use server";
    await addStudent(formData);
  }
  return (
    <form action={addStudentData}>
      <div className='flex flex-wrap items-center justify-center gap-3 mb-3'>
        <Input
          className='w-[calc(100%/4-0.0.15rem)]'
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
        <Input
          className='w-[calc(100%/4-0.0.15rem)]'
          name='class_code'
          type='number'
          label='Class Code'
          placeholder='Enter Student Class Code'
        />
        <Input
          className='w-[calc(100%/4-0.0.15rem)]'
          name='group_code'
          type='number'
          label='Group Code'
          placeholder='Enter Student Group Code'
        />
      </div>
      <Button type='submit' color='primary' auto>
        Add Student
      </Button>
    </form>
  );
}
