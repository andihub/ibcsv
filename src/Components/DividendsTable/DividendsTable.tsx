import React, { useState, FunctionComponent, useEffect } from "react";
import { Table } from "antd";
import { DividendRecord } from "../Parser/parseDividendRecords";
import { ColumnProps } from "antd/lib/table";

interface IDividendsTableProps {
  dividends?: DividendRecord[];
}
type DataSourceRecord = DividendRecord & {
  key: any;
};
const DividendsTable: FunctionComponent<IDividendsTableProps> = ({
  dividends
}) => {
  const [dataSource, setDataSource] = useState<DataSourceRecord[]>([]);

  useEffect(() => {
    const ds = (dividends || [])
      .filter(r => r.Code === "Po")
      .map((r, i) => ({ ...r, key: i }));
    setDataSource(ds);
  }, [dividends]);
  if (!dividends) {
    return <div>no dividends</div>;
  }

  const columns = getColumns(dividends);

  const rowSelection = {
    onChange: (
      selectedRowKeys: number[] | string[],
      selectedRows: DataSourceRecord[]
    ) => {
      // console.log(
      //   `selectedRowKeys: ${selectedRowKeys}`,
      //   "selectedRows: ",
      //   selectedRows
      // );
    }
  };

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      rowSelection={rowSelection}
      scroll={{ x: "max-content" }}
      bordered
      size={"small"}
      //tableLayout="fixed"
      pagination={false}
    />
  );
};

export default DividendsTable;

type KeyColumnType = string;

function getColumns(dividends: DividendRecord[]) {
  let columns = Object.keys(dividends[0]).map(
    (key: KeyColumnType) =>
      ({
        title: key,
        dataIndex: key,
        key: key,
        fixed: false
      } as ColumnProps<DataSourceRecord>)
  );

  columns = columns.filter(o =>
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
    ].includes(o.key as KeyColumnType)
  );

  const symbolColumn = columns[0];
  symbolColumn.fixed = true;

  columns = columns.map(c => {
    const columnName = c.key as string;

    c.filters = Array.from(
      new Set(
        dividends.map(
          d =>
            // @ts-ignore
            d[columnName]
        )
      )
    ).map(s => ({ text: s, value: s }));

    c.onFilter = (value, record) =>
      // @ts-ignore
      record[columnName].indexOf(value) === 0;

    c.sorter = (a, b) => {
      // @ts-ignore
      const x = a[columnName];
      // @ts-ignore
      const y = b[columnName];
      return x < y ? -1 : x > y ? 1 : 0;
    };

    return c;
  });

  // symbolColumn.filters = Array.from(
  //   new Set(dividends.map(d => d.Symbol))
  // ).map(s => ({ text: s, value: s }));

  // symbolColumn.onFilter = (value, record) => record.Symbol.indexOf(value) === 0;

  return columns;
}
