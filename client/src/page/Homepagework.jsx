import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Header from "../Header";


const Homepagework = () => {
  const [requests, setRequests] = useState([]);
  const [requestRefs, setRequestRefs] = useState([]);
  const [salesRef, setSalesRef] = useState([]);
  const [items, setItems] = useState([]);

  async function fetchData() {
    try {
      const Id = (await axios.get("/validity")).data.Id;
      const [res1, res2, res3, res4] = await Promise.all([
        axios.get("/request"),
        axios.get("/request_ref"),
        axios.get("/sales_ref"),
        axios.get("/item"),
      ]);
      const userRequests = res1.data.filter(
        (req) => req.userId === parseInt(Id) && req.statusId === 4
      );
      setRequests(userRequests);
      setRequestRefs(res2.data);
      setSalesRef(res3.data);
      setItems(res4.data);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (requestId) => {
    const request = requests.find((req) => req.Id === requestId);
    const matchingRequestRef = requestRefs.find(
      (ref) => ref.Id === request.requestRefId
    );
    const matchingSalesRef =
      salesRef.find(
        (saleRef) => saleRef.requestRefId === matchingRequestRef.Id
      ) || 0;
    console.log(!matchingSalesRef);
    if (!matchingSalesRef) {
      const newSalesRef = {
        requestRefId: matchingRequestRef.Id,
        totalprice: 0,
        remainprice: 0,
        comment: "hi",
        customerId: matchingRequestRef.customerId,
        statusId: 4,
      };
      const response = await axios.post("/sales_ref/add", newSalesRef);
      const newSalesRef1 = response.data.data;
      const newSale = {
        price: request.price,
        userId: request.userId,
        itemId: request.itemId,
        salesRefId: newSalesRef1.Id,
      };
      await axios
        .post("/sales/add", newSale)
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    } else {
     
      const newSale = {
        price: request.price,
        userId: request.userId,
        itemId: request.itemId,
        salesRefId: matchingSalesRef.Id, 
      };

      await axios
        .post(`/sales/add`, newSale)
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    }
    await axios.put(`/request/update/${requestId}`, { statusId: 5 });
    fetchData();
  };

  const handleReject = async (requestId) => {
    await axios.put(`/request/update/${requestId}`, { statusId: 6 });
    fetchData();
  };

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "item", headerName: "Item", width: 200 },
    { field: "userId", headerName: "User ID", width: 150 },
    { field: "price", headerName: "Price", width: 150 },
    { field: "requestRefId", headerName: "Request Ref", width: 150 },
    {
      field: "approve",
      headerName: "Approve/Reject",
      width: 250,
      renderCell: (params) => (
        <>
          <button
            className="btn rounded-pill btn-outline-success"
            onClick={(e) => handleApprove(params.row.id)}
          >
            Approve
          </button>
          <button
            className="btn rounded-pill btn-outline-danger"
            onClick={(e) => handleReject(params.row.id)}
          >
            Reject
          </button>
        </>
      ),
    },
  ];

  const rows = requests.map((req) => {
    const itemname = items.find((item) => item.Id === req.itemId);
    return {
      id: req.Id,
      item: itemname.itemName,
      userId: req.userId,
      price: req.price,
      requestRefId: req.requestRefId,
    };
  });

  return (
    <div className="h-100 w-100">
      <div className="p-3">
        <Header />
      </div>
      <div className="p-3 h-100">
        <div className="content-wrapper h-100">
          <div className="container-xxl flex-grow-1 container-p-y h-100">
            <div className="h-100">
              <DataGrid
                disableColumnFilter
                disableColumnSelector
                disableDensitySelector
                rows={rows}
                columns={columns}
                pageSize={5}
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true,
                  },
                }}
              />
            </div>
          </div>
          <div className="content-backdrop fade"></div>
        </div>
      </div>
    </div>
  );
};

export default Homepagework;
