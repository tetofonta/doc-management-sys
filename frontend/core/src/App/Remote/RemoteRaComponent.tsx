import RemoteComponent, { RemoteComponentProps } from "./RemoteComponent";
import { useContext } from "react";
import { SharingContexts } from "@dms/remote-component";

export const RemoteRaComponent = (props: RemoteComponentProps) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks, @typescript-eslint/no-explicit-any
    const context_data = SharingContexts.map((e: any) => e && useContext(e));
    const p = {
        ...props,
        context_data,
    };
    return <RemoteComponent {...p} />;
};

export default RemoteRaComponent;
