import {getClass} from "@/app/actions/classesActions";
import {Card} from "@nextui-org/react";
import GroupTable from "@/app/ui/GroupTable/GroupTable";
import Heading from "@/app/ui/Heading/Heading";

export const metadata = {
    title: 'Group Page',
    description: 'Group Page',
}
async function ClassPage({params}) {
    const {id} = params;
    const {class_} = await getClass(id);
    const {className, groups} = class_;
    const groupsData = groups.map(group => {
        return {
            ...group,
            classID: class_._id
        }
    });
    return (
        <Card>
            <Heading>{className}</Heading>
            <GroupTable groups={groupsData} classId={class_._id}/>
        </Card>
    )
}

export default ClassPage;