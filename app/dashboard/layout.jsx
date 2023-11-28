import SideBar from "../ui/Sidebar/Sidebar";

export default function Layout({ children }) {
  return (
    <main className='flex'>
      <SideBar />
      <section className='me-[250px]'>{children}</section>
    </main>
  );
}
