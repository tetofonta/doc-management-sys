import { MessageBox, MessageDialogSize, MessageDialogType } from "../../MessageBox/MessageBox";
import * as pkg from "../../../../package.json";
import { Title } from "react-admin";
import { useModalContext } from "../../Modal/modalContext";
import { Button } from "@mui/material";
import { SentimentSatisfiedAlt } from "@mui/icons-material";
import { YesNoCbProps, YesNoDisplayModalProps, YesNoResult } from "../../Modal/Modals/YesNoModal";
import { MessageDisplayModalProps } from "../../Modal/Modals/MessageModal";

const AboutPage = () => {
    const { display } = useModalContext();

    return (
        <>
            <Title title={"About"} />
            <MessageBox
                size={MessageDialogSize.LARGE}
                title={"Document Management System"}
                message={
                    <>
                        <p>Yep, a better name may be better...</p>
                        <p>
                            Document management microservice system by <a href={"https://me.stefanofontana.com"}>@tetofonta</a>
                        </p>
                        <p>Version: {pkg.version}</p>
                    </>
                }
                type={MessageDialogType.INFO}
            />
            <Button
                onClick={() =>
                    display({
                        kind: "yesno",
                        title: "Are You good",
                        display_message: "plz tell me",
                        cb: (args: YesNoCbProps) => {
                            switch (args.result) {
                                case YesNoResult.YES:
                                    return display({
                                        kind: "message",
                                        title: "Yuppi!",
                                        display_message: "I'm glad to hear that",
                                    } as MessageDisplayModalProps);
                                default:
                                    return display({
                                        kind: "message",
                                        title: "Sad!",
                                        display_message: "Get up and stop working. you need a holiday!",
                                    } as MessageDisplayModalProps);
                            }
                        },
                    } as YesNoDisplayModalProps)
                }
            >
                <SentimentSatisfiedAlt />
            </Button>
        </>
    );
};

export default AboutPage;
