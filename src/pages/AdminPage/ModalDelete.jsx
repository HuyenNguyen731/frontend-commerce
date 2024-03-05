import React from "react";
import Loading from "../../components/LoadingComponent/Loading";
import {Modal} from "antd/es";

const ModalDelete = ({open, onCancel, onOk, isLoading }) => {
    return (
        <Modal title="Xóa sản phẩm" open={open} onCancel={onCancel} onOk={onOk}>
            <Loading isLoading={isLoading}>
                <div>Bạn có chắc xóa sản phẩm này không?</div>
            </Loading>
        </Modal>
    )
}

export default ModalDelete
