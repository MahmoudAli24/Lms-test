import {Card, CardBody} from "@nextui-org/react";
import {getClass} from "@/app/actions/classesActions";
import EditClassForm from "@/app/ui/EditClassForm/EditClassForm";

export default async function editClassPage({params}) {
    const id = params.id
    const {class_} = await getClass(id)


    return (<Card>
        <CardBody>
            <EditClassForm
                classData={class_}
            />
        </CardBody>
    </Card>)
}