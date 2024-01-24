import { PluginResourceType } from "../../resources";
import React, { Suspense } from "react";
import { EditGuesser, ShowGuesser } from "react-admin";

const GroupList = React.lazy(() => import("./Groups/List"));
const GroupDetail = React.lazy(() => import("./Groups/Detail"));

const GroupResource = {
    name: "local-groups",
    options: {
        label: "Local Groups",
    },
    list: () => (
        <Suspense>
            <GroupList />
        </Suspense>
    ),
    show: () => (
        <Suspense>
            <GroupDetail />
        </Suspense>
    ),
    edit: EditGuesser,
    requiredListFeatures: ["localgroup:list"],
    requiredShowFeatures: ["localgroup:get"],
    requiredEditFeatures: ["localgroup:edit"],
    requiredCreateFeatures: ["localgroup:create"],
} as PluginResourceType;
export default GroupResource;
