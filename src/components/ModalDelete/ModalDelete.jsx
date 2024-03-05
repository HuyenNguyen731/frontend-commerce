import React from "react";
import Loading from "../LoadingComponent/Loading";
import { Modal } from "antd/es";

const ModalDelete = ({open, onCancel, onOk, isLoading, title, description }) => {
    return (
        <Modal title={title} open={open} onCancel={onCancel} onOk={onOk}>
            <Loading isLoading={isLoading}>
                <div>{description}</div>
            </Loading>
        </Modal>
    )
}

export default ModalDelete
