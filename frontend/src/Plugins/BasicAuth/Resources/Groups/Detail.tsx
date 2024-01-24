import { Datagrid, List, Show, SimpleShowLayout, TextField } from 'react-admin';

const GroupList = () => {
    return (
        <Show>
            <SimpleShowLayout>
                <TextField source="name" variant={"h3"} />
                <TextField source="id" variant={"overline"} />

                
            </SimpleShowLayout>
        </Show>
    );
};

export default GroupList;
