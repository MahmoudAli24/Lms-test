import SideBar from "../ui/Sidebar/Sidebar";

export default function Layout(props) {
  return (
    <main className='tablet:flex'>
      <SideBar />
      <section className='p-4 tablet:w-[calc(100%-250px)] '>
        {props.children}
        {props.modal}
      </section>
    </main>
  );
}
