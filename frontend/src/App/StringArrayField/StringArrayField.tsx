import { useRecordContext } from "react-admin";
import { Chip, Tooltip } from '@mui/material';

export type StringArrayFieldProps = {
    source: string;
    max_display: number;
    onClick?: (val: string, i: number) => void;
};

export const StringArrayField = ({ source, max_display, onClick }: StringArrayFieldProps) => {
    const record = useRecordContext();
    const value = source.split(".").reduce((a, b) => a[b], record);

    if (!Array.isArray(value)) return <p>Error: not an array</p>;

    const display_length = value.length <= max_display ? value.length : max_display - 1;

    return (
        <div>
            {value.slice(0, display_length).map((e, i) => (
                <Tooltip title={e}><Chip style={{maxWidth: "7em", margin: "0.1rem"}} key={i} label={e} onClick={() => onClick && onClick(e, i)}/></Tooltip>
            ))}
            {value.length > max_display && <Tooltip title={value.join(", ")}><Chip label="..."/></Tooltip>}
        </div>
    );
};
