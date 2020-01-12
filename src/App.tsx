import React, { useState, useEffect } from "react";
import { Button, Layout, message, Menu } from "antd";
import "./App.css";
import CsvUploader from "./Components/CsvUploader/CsvUploader";
import { RcFile } from "antd/lib/upload";
import DividendsTable from "./Components/DividendsTable/DividendsTable";
import {
  parseDividendRecords,
  DividendRecord
} from "./Components/Parser/parseDividendRecords";

const { Header, Content, Footer } = Layout;

const App = () => {
  const [file, setFile] = useState<RcFile | undefined>();

  const [dividends, setDividends] = useState<DividendRecord[]>();

  const onFileChanged = (csvFile: RcFile) => {
    setFile(csvFile);
  };

  useEffect(() => {
    const readFile = async () => {
      if (!file) {
        message.error("no file specified");
        return;
      }

      const d = await parseDividendRecords(file);
      setDividends(d);
    };
    readFile();
  }, [file]);

  return (
    <Layout style={{ height: "100vh" }}>
      <Header style={{ position: "fixed", zIndex: 1, width: "100%" }}>
        <div className="logo">
          <h1>ibcsv</h1>
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["1"]}
          style={{ lineHeight: "64px" }}
        >
          <Menu.Item key="1">Dividends</Menu.Item>
          {/* <Menu.Item key="2">nav 2</Menu.Item>
        <Menu.Item key="3">nav 3</Menu.Item> */}
        </Menu>
      </Header>
      <Content
        style={{
          padding: "0 50px",
          marginTop: 64,
          height: "100%",
          overflow: "scroll"
        }}
      >
        <div style={{ background: "#fff", padding: 24, minHeight: "100%" }}>
          {!file ? (
            <CsvUploader onFileChanged={onFileChanged}></CsvUploader>
          ) : (
            <>
              <Button type="primary" onClick={() => setFile(undefined)}>
                Clear file
              </Button>
              <DividendsTable dividends={dividends}></DividendsTable>
            </>
          )}
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        ibcsv ©2019-2020 Created by andidev
      </Footer>
    </Layout>
  );
};

export default App;
