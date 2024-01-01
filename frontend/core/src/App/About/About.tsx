import { Typography } from "@mui/material";
import { MessageBox, MessageDialogType } from "../MessageBox/MessageBox";
import * as pkg from "../../../package.json";

const AboutPage = () => {
    return (
        <MessageBox
            title={"Document Management System"}
            message={
                <>
                    <p>Yep, a better name may be better...\nDocument management microservice system by{" "}
                        <a href={"https://me.stefanofontana.com"}>@tetofonta</a></p>
                    <p>Version: {pkg.version}</p>
                </>
            }
            type={MessageDialogType.INFO}
        />
    );
};

export default AboutPage;
