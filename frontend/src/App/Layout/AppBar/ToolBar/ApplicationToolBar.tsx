import "./style/style.sass";
import { useApplicationCustomRoutes } from "../../../../Plugins/routes";
import { IconButtonWithTooltip, Menu } from "react-admin";
import { getIcon } from "../../../utils";
import React from "react";
import { useNavigate } from "react-router-dom";

export interface CustomRouteToolbarDescriptor {
    label: string;
    icon: string;
}

const ApplicationToolBar = () => {
    const custom_routes = useApplicationCustomRoutes();
    const navigate = useNavigate();

    return (
        <div className={"toolbar"}>
            {custom_routes
                .filter((e) => !!e.toolBar)
                .map((e) => (
                    <IconButtonWithTooltip key={e.route} onClick={() => navigate(e.route)} label={e.toolBar?.label || ""}>
                        {getIcon(e.toolBar?.icon, { fontSize: "small", className: "toolbarIcon" })}
                    </IconButtonWithTooltip>
                ))}
        </div>
    );
};

export default ApplicationToolBar;
