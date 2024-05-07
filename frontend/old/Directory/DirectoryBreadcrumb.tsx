import { useDirectoryContext } from "./directoryContext";
import { Link, Typography, Breadcrumbs } from "@mui/material";
import { NavigateNext } from "@mui/icons-material";

export const DirectoryBreadcrumb = () => {
    const dir = useDirectoryContext();

    const steps = dir.path.map((e, i, a) => {
        if (i === a.length - 1 || i === 0) return <Typography key={i}>{e.name}</Typography>;
        return (
            <Link
                underline="hover"
                key={i}
                onClick={() => {
                    dir.navigate(i);
                }}
            >
                {e.name}
            </Link>
        );
    });

    return <Breadcrumbs separator={<NavigateNext fontSize="small" />}>{steps}</Breadcrumbs>;
};
