import {Alert, Box, Button, Grid, Group, Text} from "@mantine/core";
import {IconCheck, IconX} from "@tabler/icons-react";
import Modal, { Props as ModalProps } from "./Modal";
import { client } from "../../lib/axiosClient";
import {Notyf} from "notyf";
import { useState } from "react";
import { notifications } from "@mantine/notifications";

import Cookies from "universal-cookie";
import { useTranslation } from "react-i18next";
import QRCode from "react-qr-code";

const cookies = new Cookies(null, { path: '/' });
const {Col} = Grid

type Props = {
    setSelectedData?: (id: string) => void;
    data?: any;
    refetchData?: () => void;
} & ModalProps;

export const ShowQRStore = ({data, ...props}: Props) => {
    const { t } = useTranslation();
    
    const closeModal = () => {
        props.onClose();
    };

    return (
        <Modal
            {...props} onClose={closeModal} size="lg"
            footer={<></>}
        >
            <Box style={({ colors }) => ({padding: 20})}>
                <Grid gutter={20} justify="center" align="center">
                    <Col span={12} style={{alignSelf: "center", textAlign: "center"}}>
                        <QRCode
                            size={256}
                            style={{ height: "auto", maxWidth: 200, width: "60%"}}
                            // fgColor="#fcd008"
                            value={process.env.REACT_APP_STORE_URL as string}
                            viewBox={`0 0 256 256`}
                        />
                    </Col>
                </Grid>
            </Box>
        </Modal>
    );
};