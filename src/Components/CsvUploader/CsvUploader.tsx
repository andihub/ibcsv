import React from "react";
import { Upload, Icon } from "antd";
import { RcFile } from "antd/lib/upload";

const { Dragger } = Upload;

interface ICsvUploaderProps {
  onFileChanged: (csvFile: RcFile) => void;
}
const CsvUploader = (props: ICsvUploaderProps) => {
  const draggerProps = {
    name: "file",
    multiple: false,
    beforeUpload: (file: RcFile) => {
      props.onFileChanged(file);
      return false;
    }
  };

  return (
    <Dragger {...draggerProps}>
      <p className="ant-upload-drag-icon">
        <Icon type="inbox" />
      </p>
      <p className="ant-upload-text">
        Click or drag file to this area to upload
      </p>
      <p className="ant-upload-hint">
        Support for a single or bulk upload. Strictly prohibit from uploading
        company data or other band files
      </p>
    </Dragger>
  );
};

export default CsvUploader;
