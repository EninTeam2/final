import axios from "axios";
import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Header from "../Header";
import { useNavigate } from "react-router-dom";


const AllSalesRef = () => {
  const [message, setMessage] = useState([]);
  const [remains, setRemain] = useState([]);
  const [salesRefs, setSalesRefs] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [res1, res2, res3, res4] = await Promise.all([
          axios.get("remain_price"),
          axios.get("/sales_ref"),
          axios.get("/customer"),
          axios.get("/status"),
        ]);
        setRemain(res1.data);
        setSalesRefs(res2.data);
        setCustomers(res3.data);
        setStatuses(res4.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const filteredRows = salesRefs.filter((saleRef) => {
    if (!startDate || !endDate) return true; 
    const saleDate = new Date(saleRef.date);
    return saleDate >= new Date(startDate.toDateString()) && saleDate <= new Date(endDate.toDateString());
  });

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "customerName", headerName: "Customer Name", width: 200 },
    { field: "customerPhoneNo", headerName: "Customer Phone No", width: 200 },
    { field: "date", headerName: "Date", width: 150 },
    { field: "time", headerName: "Time", width: 150 },
    { field: "paidPrice", headerName: "Paid Price", width: 150 },
    { field: "remainPrice", headerName: "Remain Price", width: 150 },
  ];

  const rows = filteredRows.map((saleRef) => {
    const date = new Date(saleRef.date);

    const customer = customers.find((cust) => cust.Id === saleRef.customerId);
    const customerName = customer ? `${customer.firstName} ${customer.lastName}` : "";

    const status = statuses.find((stat) => saleRef.statusId === stat.Id);

    return {
      id: saleRef.Id,
      customerName: customerName,
      customerPhoneNo: customer.phone_no,
      date: `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`,
      time: `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`,
      paidPrice: saleRef.totalprice,
      remainPrice: saleRef.remainprice,
    };
  });

  const navigate = useNavigate();

  const handlRowClick = (params) => {
    const remain = remains.filter((r) => parseInt(r.salesRefId) === parseInt(params.row.id));
    setRemain(remain);
    openPopup();
  };

  const rows1 = remains.map((remain) => {
    const date = new Date(remain.date);

    return {
      id: remain.Id,
      date: `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`,
      time: `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`,
      paidprice: remain.paidprice,
      remainprice: remain.remainprice,
    };
  });

  const columns1 = [
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
      <div className="p-3">
        <div className="content-wrapper">
          <div className="container-xxl flex-grow-1 container-p-y">
            <div className="filter-container">
              <label>Start Date: </label>
              <input type="date" onChange={(e) => setStartDate(new Date(e.target.value))} />
              <label>End Date: </label>
              <input type="date" onChange={(e) => setEndDate(new Date(e.target.value))} />
            </div>
            <div style={{ height: "calc(100vh - 150px)", width: "100%" }}>
              <DataGrid
                onRowClick={handlRowClick}
                rows={rows}
                disableColumnFilter
                disableColumnSelector
                disableDensitySelector
                columns={columns}
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true,
                  },
                }}
                pageSize={5}
              />
            </div>
            {/* Popup */}
            {isPopupOpen && (
              <div className="popup-container">
                <div className="popup">
                  <i
                    className="bx bxs-x-square fa-3x"
                    onClick={closePopup}
                    style={{ float: "right" }}
                  ></i>
                  <br />
                  <br />
                  <div style={{ height: 400, width: "100%" }}>
                    <DataGrid rows={rows1} columns={columns1} pageSize={5} />
                  </div>
                </div>
                <div className="content-backdrop fade"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllSalesRef;