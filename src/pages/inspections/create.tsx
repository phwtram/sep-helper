
import { InspectorDrawerForm } from "@/components/inspection";
import { useGetToPath, useGo } from "@refinedev/core";
import { useSearchParams } from "react-router";

export const InspectorCreate = () => {
      const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
    return <InspectorDrawerForm action="create" onMutationSuccess={() => {
        go({
          to:
            searchParams.get("to") ??
            getToPath({
              action: "list",
            }) ??
            "",
          query: {
            to: undefined,
          },
          options: {
            keepQuery: true,
          },
          type: "replace",
        });
      }}
    />;
};
