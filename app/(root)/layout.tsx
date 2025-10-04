import { ReactNode } from "react";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import SpaceBackground from "@/components/SpaceBackground";

import { isAuthenticated, getCurrentUser } from "@/lib/actions/auth.action";

const Layout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect("/sign-in");

  const user = await getCurrentUser();

  return (
    <div className="min-h-screen relative">
      <SpaceBackground />
      <div className="relative z-10">
        <Navbar userEmail={user?.email} userName={user?.name} />
        {children}
      </div>
    </div>
  );
};

export default Layout;
