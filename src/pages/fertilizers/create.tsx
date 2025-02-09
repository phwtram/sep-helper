import { FertilizerDrawerForm } from "@/components/fertilizer";
import { useGetToPath, useGo } from "@refinedev/core";
import { useSearchParams } from "react-router";

export const FertilizersCreate = () => {
      const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
    return <FertilizerDrawerForm action="create" onMutationSuccess={() => {
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
