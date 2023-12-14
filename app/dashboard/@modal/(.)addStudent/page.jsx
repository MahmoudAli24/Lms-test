import {getClassesOptions} from "@/app/actions/classesActions";
import {getGroupsOptions} from "@/app/actions/groupsActions";
import AddStudentForm from "@/app/ui/AddStudentForm/AddStudentForm";
import AddStudentModal from "@/app/ui/AddStudentModal";

export default async function page() {
    const classesOptions = await getClassesOptions()
    const groupsOptions = await getGroupsOptions()

    return (
        <AddStudentModal title={"Add Student"}>
            <AddStudentForm classesOptions={classesOptions} groupsOptions={groupsOptions}/>
        </AddStudentModal>
    );
}
