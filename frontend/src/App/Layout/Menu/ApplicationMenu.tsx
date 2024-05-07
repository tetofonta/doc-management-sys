import "./style/style.sass";
import { Menu, MenuProps, ResourceDefinition } from 'react-admin';
import { useApplicationCustomRoutes } from "../../../Plugins/routes";
import { getIcon } from "../../utils";
import { useResourceDefinitions } from "ra-core";
import { AuthenticatedResourceProps } from "../../Resources/AuthenticatedResource/AuthenticatedResource";
import { useCallback, useMemo, useState } from "react";
import { Collapse, CollapseProps, List, ListItemButton, ListItemText, Typography } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

export interface CustomRouteSidebarDescriptor {
    label: string;
    icon: string;
}

const CollapsableResourceGroup = (props: Omit<CollapseProps, "in"> & { group: string }) => {
    const { group, ...oth } = props;
    const [open, setOpen] = useState(true);
    // const children = Array.isArray(props.children) ? props.children.length : 1;

    const handleClick = useCallback(() => {
        setOpen((v) => !v);
    }, []);

    return (
        <>
            <ListItemButton onClick={handleClick} className={"listGroup"}>
                <ListItemText
                    primary={
                        <>
                            <Typography variant={"overline"}>{group}</Typography>{" "}
                            {/*{!open && <Chip size="small" label={"+" + children} />}*/}
                        </>
                    }
                />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} {...oth}>
                <List component="div" disablePadding>
                    {props.children}
                </List>
            </Collapse>
        </>
    );
};

export const ApplicationMenu = (props: MenuProps) => {
    const customRoutes = useApplicationCustomRoutes();
    const resources: { [k: string]: AuthenticatedResourceProps } = useResourceDefinitions();

    const groups = useMemo(
        () =>
            Object.keys(resources)
                .map((k) => resources[k])
                .filter((e: ResourceDefinition) => e.hasList)
                .reduce(
                    (a, b) => {
                        const group = b.group ?? "default";
                        if (!a[group]) a[group] = [];
                        a[group].push(b);
                        return a;
                    },
                    {} as { [k: string]: AuthenticatedResourceProps[] },
                ),
        [resources],
    );

    const groupsSorted = useMemo(() => Object.keys(groups).sort((a, b) => a.localeCompare(b)), [groups]);

    return (
        <Menu {...props} className={"sidebarFlexContainer"}>
            <div>
                {groups.default && groups.default.map((e, i) => <Menu.ResourceItem name={e.name} key={i} />)}
                {groupsSorted
                    .filter((e) => e !== "default")
                    .map((k, i) => (
                        <CollapsableResourceGroup key={i} group={k}>
                            {(groups[k] || []).map((e, i) => (
                                <Menu.ResourceItem name={e.name} key={i} />
                            ))}
                        </CollapsableResourceGroup>
                    ))}
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
