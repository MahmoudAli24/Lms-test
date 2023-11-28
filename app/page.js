import { Button, Input } from "@nextui-org/react";

export default function Home() {
  return (
    <main>
      <div className='w-[500px] mx-auto mt-10'>
        <form className='flex flex-col gap-3'>
          <h2 className='text-center text-3xl'>Enter Student ID</h2>
          <Input
            type='number'
            label='Student ID'
            placeholder='Enter your student ID'
            variant='bordered'
          />
          <Button auto>Search</Button>
        </form>
      </div>
    </main>
  );
}
