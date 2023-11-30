import SideBar from "../ui/Sidebar/Sidebar";

export default function Layout({ children }) {
  return (
    <main className='tablet:flex'>
      <SideBar />
      <section className='p-4 tablet:w-[calc(100%-250px)] '>{children}</section>
    </main>
  );
}
