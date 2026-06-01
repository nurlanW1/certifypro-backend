import { redirect } from "next/navigation"

/** Legacy route — event workspaces live under /dashboard/events */
export default function WorkspacesPage() {
  redirect("/dashboard/events")
}
