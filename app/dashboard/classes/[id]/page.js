import {getClass} from "@/app/actions/classesActions";
import {Card} from "@nextui-org/react";
import GroupTable from "@/app/ui/GroupTable/GroupTable";
import Heading from "@/app/ui/Heading/Heading";

async function ClassPage({params}) {
    const {id} = params;
    const {class_} = await getClass(id);
    const {className, groups} = class_;
    return (
        <Card>
            <Heading>{className}</Heading>
            <GroupTable groups={groups}/>
        </Card>
    )
}

export default ClassPage;