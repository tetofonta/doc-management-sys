import "./style/style.sass";
import { Title } from "react-admin";
import { Typography, Paper, Box, Chip, IconButton, Tooltip, List, ListItemButton } from "@mui/material";
import { DisplaySettings } from "@mui/icons-material";
import { useApplicationAuthProvider } from "../../../providers/auth/context";
import { useModalContext } from "../../Modal/modalContext";
import React, { Suspense, useCallback } from "react";
import { MessageDisplayModalProps } from "../../Modal/Modals/MessageModal";
import { UserProfileComponents, useUserProfileComponentsContext } from "../../../Plugins/user_profile_components";

const CurrentAccountInfo = () => {
    const auth = useApplicationAuthProvider();
    const identity = auth.getIdentitySync();
    const { display } = useModalContext();

    const components = useUserProfileComponentsContext();
    const groups = components.reduce(
        (a, b) => {
            if (b.source && b.source != identity?.source) return a;
            if (!a[b.group]) a[b.group] = [];
            a[b.group].push(b);
            return a;
        },
        {} as { [k: string]: UserProfileComponents[] },
    );

    const showFeaturesCb = useCallback(() => {
        display({
            kind: "message",
            title: "User Features",
            display_message: (
                <List>{auth.getIdentitySync()?.features.map((e, i) => <ListItemButton key={i}>{e}</ListItemButton>)}</List>
            ),
        } as MessageDisplayModalProps);
    }, [display, auth]);

    return (
        <>
            <Title title={"Account Info"} />
            <Paper className={"paperContainer"}>
                <Box className={"itemRow"}>
                    <Typography variant={"overline"}>username</Typography>
                    <Typography variant={"h4"}>{identity?.fullName}</Typography>
                </Box>

                <Box className={"itemRow"}>
                    <Typography variant={"overline"}>Login Source</Typography>
                    <Typography variant={"h6"}>{identity?.source}</Typography>
                </Box>

                <Box className={"itemRow"}>
                    <Typography variant={"overline"}>Groups</Typography>
                    <div>{identity?.groups.map((e, i) => <Chip key={i} label={e} />)}</div>
                </Box>

                <Box className={"itemRow"}>
                    <Tooltip title={"Show current features"}>
                        <IconButton onClick={showFeaturesCb}>
                            <DisplaySettings />
                        </IconButton>
                    </Tooltip>
                </Box>

                {Object.keys(groups).map((k) => (
                    <Box key={k} className={"itemRow"}>
                        <Typography variant={"overline"}>{k}</Typography>
                        {groups[k].map((o, i) => (
                            <Suspense key={i}>{React.createElement(o.component, {})}</Suspense>
                        ))}
                    </Box>
                ))}
            </Paper>
        </>
    );
};

export default CurrentAccountInfo;
