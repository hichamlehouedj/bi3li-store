import { ReactElement, useState } from "react";
import {Modal as ModalUI, ModalProps, Overlay, Loader, Stack, Box, useMantineTheme, ScrollArea} from "@mantine/core";

export type Props = {
    header?: ReactElement;
    footer?: ReactElement;
    size?: string;
    loading?: boolean;
} & ModalProps;

function Modal({size, loading, ...props}: Props) {
    const { children, footer } = props;
    const {colors} = useMantineTheme();

    return (
        <ModalUI 
            {...props} size={size || "xl"} centered={true} closeOnClickOutside={false}
            scrollAreaComponent={ScrollArea.Autosize}
            styles={{
                body: {
                    background: colors.gray[1],
                    position: "relative",
                    padding: 0
                },
                header: {
                    boxShadow: "#bbb 0px 1px 10px -5px"
                }
            }}
        >
            {loading && <Overlay color="#000" backgroundOpacity={0.35} blur={1} zIndex={100}>
            </Overlay>}
            {/* content */}
            
            <Box p={"md"}>
                {children}
            </Box>

            {/* footer */}
            <Box 
                bg={"#fff"} w={"100%"} pos={"sticky"}
                style={{
                    bottom: 0, zIndex: 1001, left: 0, right: 0,
                    boxShadow: "#bbb 0px 0px 10px -5px"
                }}
            >
                {footer}
            </Box>
        </ModalUI>
    );
}

export default Modal;
