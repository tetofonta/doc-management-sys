import { Layout, LayoutProps } from "react-admin";
import ApplicationAppBar from "./AppBar/ApplicationAppBar";

const ApplicationLayout = (props: LayoutProps) => {
    return <Layout {...props} appBar={ApplicationAppBar} appBarAlwaysOn />;
};

export default ApplicationLayout;
