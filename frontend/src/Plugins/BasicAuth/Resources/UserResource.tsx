import { PluginResourceType } from "../../resources";
import React, { Suspense } from "react";
import { Person } from "@mui/icons-material";

const UserList = React.lazy(() => import("./Users/List"));
const UserDetail = React.lazy(() => import("./Users/Detail"));
const UserForm = React.lazy(() => import("./Users/Form"));

const UserResource = {
    name: "local-users",
    group: "Local Authentication",
    icon: Person,
    options: {
        label: "Local Users",
    },
    list: () => (
        <Suspense>
            <UserList />
        </Suspense>
    ),
    show: () => (
        <Suspense>
            <UserDetail />
        </Suspense>
    ),
    edit: () => (
        <Suspense>
            <UserForm create={false} />
        </Suspense>
    ),
    create: () => (
        <Suspense>
            <UserForm create={true} />
        </Suspense>
    ),
    requiredListFeatures: ["localuser:list"],
    requiredCreateFeatures: ["localuser:admin:create"],
    requiredEditFeatures: ["localuser:admin:edit"],
    requiredShowFeatures: ["localuser:admin:get"],
} as PluginResourceType;
export default UserResource;
