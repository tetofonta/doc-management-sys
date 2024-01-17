import { MessageBox, MessageDialogSize, MessageDialogType } from "../MessageBox/MessageBox";
import * as pkg from "../../../package.json";
import { Title } from "react-admin";

const AboutPage = () => {
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
        </>
    );
};

export default AboutPage;
