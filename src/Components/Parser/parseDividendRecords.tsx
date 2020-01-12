import { RcFile } from "antd/lib/upload";
import Papa from "papaparse";

export type DividendRecord = {
  ClientAccountID: string; // "U2810194"
  AccountAlias: string; //""
  Model: string; //""
  CurrencyPrimary: string; //"USD"
  FXRateToBase: string; //"0.99436"
  AssetClass: string; //"STK"
  Symbol: string; //"O"
  Description: string; //"REALTY INCOME CORP"
  Conid: string; //"10672"
  SecurityID: string; //"756109104"
  SecurityIDType: string; //"CUSIP"
  CUSIP: string; //"756109104"
  ISIN: string; //""
  ListingExchange: string; //"NYSE"
  UnderlyingConid: string; //""
  UnderlyingSymbol: string; //""
  UnderlyingSecurityID: string; //""
  UnderlyingListingExchange: string; //""
  Issuer: string; //""
  Multiplier: string; //"1"
  Strike: string; //""
  Expiry: string; //""
  PutCall: string; //""
  PrincipalAdjustFactor: string; //""
  ReportDate: string; //"2019-01-31"
  Date: string; //"2019-01-30"
  ExDate: string; //"2019-01-31"
  PayDate: string; //"2019-02-15"
  Quantity: string; //"15"
  Tax: string; //"0.51"
  Fee: string; //"0"
  GrossRate: string; //"0.2255"
  GrossAmount: number; //"3.38"
  NetAmount: string; //"2.87"
  Code: string; //"Po"
  FromAcct: string; //""
  ToAcct: string; //""
};

export async function parseDividendRecords(file: RcFile) {
  const csvParsed = await new Promise(resolve => {
    Papa.parse(file, {
      // header: true,
      complete: result => resolve(result)
    });
  });

  const csvArr = (csvParsed as any).data
    .filter(
      (r: any) =>
        (r[0] === "HEADER" && r[1] === "CDIV") ||
        (r[0] === "DATA" && r[1] === "CDIV")
    )
    .map((r: any) => r.slice(2));

  const unparsedHeader = Papa.unparse(csvArr);
  const reparsed = Papa.parse(unparsedHeader, { header: true });

  const mapToDivRecord = (r: any) => {
    r["PutCall"] = r["Put/Call"];
    delete r["Put/Call"];
    return { ...r, GrossAmount: Number(r.GrossAmount) } as DividendRecord;
  };

  return reparsed.data.map(mapToDivRecord);
}
