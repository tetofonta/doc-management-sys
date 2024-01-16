import { useState } from "react";

export const MessageModal = () => {
    const [show, setShow] = useState(false);

    return {
        name: "message",
        component: <p>AAAA {show}</p>,
        show: () => {
            setShow(true);
        },
    };
};
