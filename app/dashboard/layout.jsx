import SideBar from "../ui/Sidebar/Sidebar";

export default function Layout({ children }) {
  return (
    <main className='flex'>
      <SideBar />
      <section
        style={{
          width: "calc(100% - 250px)",
        }}
        className='p-4'
      >
        {children}
      </section>
    </main>
  );
}
