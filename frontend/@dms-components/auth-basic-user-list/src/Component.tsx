import {
    Datagrid,
    TextField,
    List,
    useNotify,
    EditButton,
} from "react-admin";
import { Button } from '@mui/material';
import { useQueryClient } from "react-query"


export const Component = () => {
    const qc = useQueryClient()
    console.log(qc)
    const notify = useNotify()

    return <List hasCreate={true}>
        <Datagrid>
            <TextField source={"username"}/>
            <TextField source={"name"}/>
            <EditButton/>
            <Button onClick={() => notify("CIAOOO")}>Ciao</Button>
        </Datagrid>
    </List>
};
