import Header from "@/components/chat/header";
import SideBar from "@/components/chat/sidebar";
import ChatCard from "@/components/ChatCard";

const Home = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[300px] border-r bg-gray-100">
        <SideBar />
      </aside>

      {/* Main Chat Area */}
      <main className="flex flex-col flex-1">
        {/* Header */}
        <header className="h-[60px] border-b bg-white px-4 shadow-sm flex items-center">
          <Header />
        </header>

        {/* Chat Body */}
        <section className="flex-1 overflow-y-auto bg-gray-50">
          <ChatCard />
        </section>
      </main>
    </div>
  );
};

export default Home;
