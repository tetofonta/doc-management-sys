import { DirectoryContext, DirectoryDescriptor } from "./directoryContext";
import { PropsWithChildren, useEffect, useState } from "react";
import { useApplicationAuthProvider } from "../../../providers/auth/context";

function dir_permission(dir: DirectoryDescriptor | undefined, id: string, groups: string[], permission: string) {
    if (!dir) return false;
    return (
        dir.owner === id ||
        (groups.includes(dir.group) && dir.group_permissions.includes(permission)) ||
        dir.guest_permissions.includes(permission)
    );
}

export const DirectoryContextProvider = (props: PropsWithChildren) => {
    const auth = useApplicationAuthProvider();
    const [path, setPath] = useState<DirectoryDescriptor[]>([]);
    const [curDir, setCurDir] = useState<DirectoryDescriptor | undefined>();

    useEffect(() => {
        auth.fetchJson("/api/directories/root").then(({ json }) => {
            const dir = {
                id: json.id,
                name: json.name,
                group: json.group,
                owner: json.owner,
                group_permissions: json.group_permissions,
                guest_permissions: json.guest_permissions,
            };
            setPath([dir]);
            setCurDir(dir);
        });
    }, [auth]);

    return (
        <DirectoryContext.Provider
            value={{
                path,
                current: curDir,
                push: async (id: string) => {
                    const { json } = await auth.fetchJson(`/api/directories/${id}`);
                    setPath((p) => {
                        p.push(json);
                        return p;
                    });
                    setCurDir(json);
                },
                pop: () => {
                    const prev = path.length > 1 ? path[path.length - 2] : undefined;
                    setPath((p) => {
                        p.pop();
                        return p;
                    });
                    setCurDir(prev);
                },
                navigate: (index: number) => {
                    if (index >= path.length) {
                        console.error("Trying to navigate in a forward path.");
                        return;
                    }
                    if (index <= 0) {
                        setCurDir(path[0]);
                        setPath([path[0]]);
                        return;
                    }
                    const new_cur = path[index];
                    setPath(path.slice(0, index + 1));
                    setCurDir(new_cur);
                },
                canEdit: () => {
                    return (
                        auth.getIdentitySync()?.superuser ||
                        (auth.hasPermissions("directory:edit") &&
                            dir_permission(
                                curDir,
                                auth.getIdentitySync()?.user_id || "",
                                auth.getIdentitySync()?.groups || [],
                                "metadata",
                            ))
                    );
                },
                canUpload: () => {
                    return (
                        auth.getIdentitySync()?.superuser ||
                        (auth.hasPermissions("file:upload") &&
                            dir_permission(
                                curDir,
                                auth.getIdentitySync()?.user_id || "",
                                auth.getIdentitySync()?.groups || [],
                                "upload",
                            ))
                    );
                },
                canCreate: () => {
                    return (
                        auth.getIdentitySync()?.superuser ||
                        (auth.hasPermissions("directory:create") &&
                            dir_permission(
                                curDir,
                                auth.getIdentitySync()?.user_id || "",
                                auth.getIdentitySync()?.groups || [],
                                "create_sub_dir",
                            ))
                    );
                },
            }}
        >
            {props.children}
        </DirectoryContext.Provider>
    );
};
