import SideBar from "../ui/Sidebar/Sidebar";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Layout(props) {
  return (
    <main className='tablet:flex'>
      <SideBar />
      <section className='p-4 tablet:w-[calc(100%-250px)] tablet:ml-[250px]'>
        {props.children}
        {props.modal}
        <ToastContainer 
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        />
      </section>
    </main>
  );
}
