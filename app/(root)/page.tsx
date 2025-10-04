import { redirect } from "next/navigation";

export default async function Home() {
  // Redirect authenticated users to dashboard
  redirect("/dashboard");
}