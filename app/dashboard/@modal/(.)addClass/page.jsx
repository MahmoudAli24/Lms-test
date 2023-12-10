import AddStudentModal from '@/app/ui/AddStudentModal'
import AddClassForm from '@/app/ui/AddClassForm/AddClassForm'

function page() {
  return (
    <AddStudentModal title={"Add Class"}>
      <AddClassForm />
    </AddStudentModal>
  )
}

export default page