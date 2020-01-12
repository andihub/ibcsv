import React, { useState, FunctionComponent, useEffect } from "react";
import { Table } from "antd";
import { DividendRecord } from "../Parser/parseDividendRecords";

interface IDividendsTableProps {
  dividends?: DividendRecord[];
}

const DividendsTable: FunctionComponent<IDividendsTableProps> = ({
  dividends
}) => {
  const [dataSource, setDataSource] = useState<
    (DividendRecord & {
      key: any;
    })[]
  >([]);

  useEffect(() => {
    const ds = (dividends || [])
      .filter(r => r.Code === "Po")
      .map((r, i) => ({ ...r, key: i }));
    setDataSource(ds);
  }, [dividends]);
  if (!dividends) {
    return <div>no dividends</div>;
  }

  const c = Object.keys(dividends[0]).map((key: string) => ({
    title: key,
    dataIndex: key,
    key: key,
    fixed: false
  }));

  const columns = c.filter(o =>
    [
      "Symbol",
      "Description",
      "Date",
      "ExDate",
      "PayDate",
      "Quantity",
      "Tax",
      "Fee",
      "GrossRate",
      "GrossAmount",
      "NetAmount",
      "Code"
    ].includes(o.key)
  );

  columns[0].fixed = true;

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      scroll={{ x: "max-content" }}
      bordered
      size={"small"}
      //tableLayout="fixed"
      pagination={false}
    />
  );
};

export default DividendsTable;
