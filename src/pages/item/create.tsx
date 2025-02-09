
import { ItemDrawerForm } from "@/components/item";
import { useGetToPath, useGo } from "@refinedev/core";
import { useSearchParams } from "react-router";

export const ItemCreate = () => {
      const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
    return <ItemDrawerForm action="create" onMutationSuccess={() => {
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
