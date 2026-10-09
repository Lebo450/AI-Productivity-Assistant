import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getWorkspace } from "@/lib/workspace.functions";
import { DashboardLayout } from "@/components/workspace/layout";
import { pageHead } from "@/lib/site-config";
export const workspaceOptions = queryOptions({
  queryKey: ["workspace"],
  queryFn: () => getWorkspace(),
});
export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => pageHead("Workspace", "Your private Connect Digital AI productivity workspace."),
  loader: ({ context }) => context.queryClient.ensureQueryData(workspaceOptions),
  component: WorkspaceRoute,
});
function WorkspaceRoute() {
  const { data } = useSuspenseQuery(workspaceOptions);
  return <DashboardLayout email={data.email} />;
}
