import "./style/style.sass";
import { Menu, MenuProps } from "react-admin";
import * as Icons from "@mui/icons-material";
import { useApplicationCustomRoutes } from "../../../Plugins/routes";
import React from "react";
import { getIcon } from '../../utils';

export interface CustomRouteSidebarDescriptor {
    label: string;
    icon: string;
}

export const ApplicationMenu = (props: MenuProps) => {
    const customRoutes = useApplicationCustomRoutes();

    return (
        <Menu {...props} className={"sidebarFlexContainer"}>
            <div>
                <Menu.ResourceItems />
            </div>
            <div>
                {customRoutes
                    .filter((e) => !!e.sideBar)
                    .map((e) => (
                        <Menu.Item
                            key={e.route}
                            to={e.route}
                            primaryText={e.sideBar?.label}
                            leftIcon={getIcon(e.sideBar?.icon)}
                        />
                    ))}
            </div>
        </Menu>
    );
};
