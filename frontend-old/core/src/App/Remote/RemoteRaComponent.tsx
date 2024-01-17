import RemoteComponent, { RemoteComponentProps } from "./RemoteComponent";
import { useContext } from "react";
import { SharingContexts } from "@dms/remote-component";
import { useQueryClient } from "react-query";

export const RemoteRaComponent = (props: RemoteComponentProps) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks, @typescript-eslint/no-explicit-any
    const context_data = SharingContexts.map((e: any) => e && useContext(e));
    const p = {
        ...props,
        context_data,
    };
    const qc = useQueryClient();
    return <RemoteComponent {...p} client={qc} />;
};

export default RemoteRaComponent;
