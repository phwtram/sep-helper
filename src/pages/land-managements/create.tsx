
import { YieldDrawerForm } from "@/components/yield";
import { useGetToPath, useGo } from "@refinedev/core";
import { useSearchParams } from "react-router";

export const YieldCreate = () => {
  console.log("✅ YieldCreate component has been rendered!");
      const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
    return <YieldDrawerForm action="create" onMutationSuccess={() => {
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
