import AddStudentForm from "@/app/ui/AddStudentForm/AddStudentForm";
import AddStudentModal from "@/app/ui/AddStudentModal";

export default function page() {
  return (
    <AddStudentModal>
      <AddStudentForm />
    </AddStudentModal>
  );
}
