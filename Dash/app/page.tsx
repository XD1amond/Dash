import { redirect } from "next/navigation"

export default function Home() {
  // Redirect to the demo page
  redirect("/demo")
}