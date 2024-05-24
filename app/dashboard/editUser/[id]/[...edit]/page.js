import EditUserForm from "@/app/ui/EditUserForm/EditUserForm";
import {getUser} from "@/app/actions/userActions";
export const metadata = {
    title: 'Edit User Page',
    description: 'Edit User Page',
}
export default async function page({params}) {
    const id = params.id
    const {user} = await getUser(id)
    return (
        <div>
           <EditUserForm user={user}/>
        </div>
    )
}