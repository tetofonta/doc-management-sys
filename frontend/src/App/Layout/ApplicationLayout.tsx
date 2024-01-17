import { Layout, LayoutProps } from "react-admin";
import ApplicationAppBar from "./AppBar/ApplicationAppBar";
import { ApplicationMenu } from "./Menu/ApplicationMenu";

const ApplicationLayout = (props: LayoutProps) => {
    return <Layout {...props} appBar={ApplicationAppBar} appBarAlwaysOn menu={ApplicationMenu} />;
};

export default ApplicationLayout;
