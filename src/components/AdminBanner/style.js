import { Upload } from "antd";
import styled from "styled-components";

export const WrapperUploadFile = styled(Upload)`
  & .ant-upload.ant-upload-select.ant-upload-select-picture-card {
    width: 200px;
    height: 100px;
  }
  & .ant-upload-list-item-info {
    display: none;
  }
  & .ant-upload-list-item {
    display: none;
  }
`;
