import {Card, CardBody} from "@nextui-org/react";
import Heading from "@/app/ui/Heading/Heading";
import UserTable from "@/app/ui/UsersTable/UserTable";

export const metadata = {
    title: 'Users',
    description: 'Users page for the dashboard',
}
export default async function page() {
    return (
        <>
            <Card>
                <Heading>Users</Heading>
                <CardBody>
                   <UserTable/>
                </CardBody>
            </Card>
        </>
    );
}