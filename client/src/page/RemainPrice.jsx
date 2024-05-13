import axios from "axios";
import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useParams } from "react-router-dom";
import Header from "../Header";
import "../App.css";


const RemainPrice = () => {
  const [remains, setremain] = useState([]);
  const { id } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [res3] = await Promise.all([axios.get(`/remain_price`)]);
        const res = res3.data.filter(
          (r) => parseInt(id) === parseInt(r.salesRefId)
        );
        setremain(res);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  console.log(id);
  const rows = remains.map((remain) => {
    const date = new Date(remain.date);

    return {
      id: remain.Id,
      date: `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`,
      time: `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`,
      paidprice: remain.paidprice,
      remainprice: remain.remainprice,
    };
  });

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "date", headerName: "Date", width: 150 },
    { field: "time", headerName: "Time", width: 150 },
    { field: "paidprice", headerName: "Paid Price", width: 150 },
    { field: "remainprice", headerName: "Remain Price", width: 150 },
  ];

  return (
    <div className="">
      <div className="p-3">
        <Header />
      </div>
      {remains.length > 0 && (
        <div className="p-3">
          <div className="">
            <div className="">
              <div style={{ height: 400, width: "100%" }}>
                <DataGrid rows={rows} columns={columns} pageSize={5} />
              </div>
            </div>
            <div className="content-backdrop fade"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RemainPrice;
