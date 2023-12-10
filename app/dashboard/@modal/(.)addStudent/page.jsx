import getClasses from "@/app/actions/getClasses";
import getGroups from "@/app/actions/getGroups";
import AddStudentForm from "@/app/ui/AddStudentForm/AddStudentForm";
import AddStudentModal from "@/app/ui/AddStudentModal";

export default async function page() {
  const { classes } = await getClasses();
  const { groups } = await getGroups();
const classNameMap = classes.reduce((map, obj) => {
    map[obj.className] = obj._id;
    return map;
  }, {});

  const classOptions = Object.keys(classNameMap).map(className => ({
    label: className,
    value: classNameMap[className],
  }));

  return (
    <AddStudentModal title={"Add Student"}>
      <AddStudentForm classOptions={classOptions} groups={groups} />
    </AddStudentModal>
  );
}
