import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../Header";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";


const Viewallreport = () => {
  const [sales, setSale] = useState([]);
  const [salesref, setSalesref] = useState([]);
  const [item, setItem] = useState([]);
  const [user, setUser] = useState([]);
  const [customer, setCustomer] = useState([]);
  const [osdate, setOsdate] = useState({
    itemstart: new Date(),
    itemend: new Date(),
    userstart: new Date(),
    userend: new Date(),
  });

  useEffect(() => {
    const alldataview = async () => {
      try {
        const [res1, res5, res6, res7] = await Promise.all([
          axios.get("/sales"),
          axios.get("/item"),
          axios.get("/user"),
          axios.get("/sales_ref"),
        ]);
        setSale(res1.data);
        setItem(res5.data);
        const res = res6.data.filter((res0) => res0.roleId === 3);
        setUser(res);
        setSalesref(res7.data);
      } catch (error) {
        console.log(error);
      }
    };
    alldataview();
  }, []);

  const handleChange = (e) => {
    setOsdate((prev) => ({
      ...prev,
      [e.target.name]: new Date(e.target.value),
    }));
  };

  const columns2 = [
    { field: "id", headerName: "Id", width: 100 },
    { field: "itemName", headerName: "Item Name", width: 150 },
    { field: "item", headerName: "Total Sold", width: 130 },
    { field: "price", headerName: "Total Price", width: 130 },
  ];
  const rows2 = item.map((it) => {
    let totalprice = 0;
    const count = salesref
      .map((saleref) => {
        const date = new Date(saleref.date);
        return (date.getFullYear() > osdate.itemstart.getFullYear() &&
          date.getFullYear() < osdate.itemend.getFullYear()) ||
          (date.getFullYear() >= osdate.itemstart.getFullYear() &&
            date.getMonth() > osdate.itemstart.getMonth() &&
            date.getFullYear() <= osdate.itemend.getFullYear() &&
            date.getMonth() < osdate.itemend.getMonth()) ||
          (date.getFullYear() >= osdate.itemstart.getFullYear() &&
            date.getMonth() >= osdate.itemstart.getMonth() &&
            date.getDate() >= osdate.itemstart.getDate() &&
            date.getFullYear() <= osdate.itemend.getFullYear() &&
            date.getMonth() <= osdate.itemend.getMonth() &&
            date.getDate() <= osdate.itemend.getDate())
          ? sales
              .map((sale) => {
                if (sale.salesRefId === saleref.Id && it.Id === sale.itemId) {
                  totalprice += sale.price;
                }

                return sale.salesRefId === saleref.Id && it.Id === sale.itemId
                  ? 1
                  : 0;
              })
              .reduce((acc, crr) => acc + crr, 0)
          : 0;
      })
      .reduce((acc, crr) => acc + crr, 0);
    return {
      id: it.Id,
      itemName: it.itemName,
      item: count,
      price: totalprice,
    };
  });

  const columns3 = [
    { field: "id", headerName: "Id", width: 90 },
    { field: "user_name", headerName: "Username", width: 130 },
    { field: "order", headerName: "Total Work", width: 130 },
  ];
  const rows3 = user.map((us) => {
    const count = salesref
      .map((saleref) => {
        const date = new Date(saleref.date);
        return 1
          ? sales
              .map((sale) => {
                return sale.salesRefId === saleref.Id && us.Id === sale.userId
                  ? 1
                  : 0;
              })
              .reduce((acc, crr) => acc + crr, 0)
          : 0;
      })
      .reduce((acc, crr) => acc + crr, 0);
    return {
      id: us.Id,
      user_name: us.user_name,
      order: count,
    };
  });
  return (
    <div className="">
      {salesref.length > 0 && (
        <div>
          {}
          <div className="p-3">
            <Header />
          </div>

          <div className="row " style={{ marginLeft: "100px" }}>
            <div
              className="col"
              style={{ maxWidth: "600px", maxHeight: "1000px", margin: "50px" }}
            >
              <div className="card h-100">
                <div className="card-header">
                  <h
                    className="m-2 "
                    style={{ fontSize: 28, color: "rgb(1, 81, 255)" }}
                  >
                    <span style={{}}>Start Date</span>
                    <span style={{ float: "right" }}>End Date</span>
                  </h>
                  <div
                    className="text-center"
                    style={{ color: "rgb(1, 81, 255)" }}
                  >
                    <input
                      type="date"
                      className="btn-sm btn-outline-primary"
                      style={{ fontSize: 16, float: "left" }}
                      name="itemstart"
                      onChange={handleChange}
                    />
                    <b style={{ fontSize: 17 }}>Item</b>
                    <input
                      type="date"
                      className="btn-sm btn-outline-primary"
                      style={{ fontSize: 16, float: "right" }}
                      name="itemend"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="card-body">
                  <div
                    className="align-items-center m-1"
                    style={{ position: "relative" }}
                  >
                    <div>
                      <DataGrid
                        disableColumnFilter
                        disableColumnSelector
                        disableDensitySelector
                        rows={rows2}
                        columns={columns2}
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
                </div>
              </div>
            </div>
            <div
              className="col"
              style={{ maxWidth: "500px", maxHeight: "1000px", margin: "50px" }}
            >
              <div className="card h-100">
                <div className="card-header">
                  {/* <h5
                    className="m-2 "
                    style={{ fontSize: 28, color: "rgb(1, 81, 255)" }}
                  >
                    <span style={{}}>Start Date</span>
                    <span style={{ float: "right" }}>End Date</span>
                  </h5> */}
                  {/* <div
                    className="text-center"
                    style={{ color: "rgb(1, 81, 255)" }}
                  >
                    <input
                      type="date"
                      className="btn-sm btn-outline-primary"
                      style={{ fontSize: 16, float: "left" }}
                      name="userstart"
                      onChange={handleChange}
                    />
                    <b style={{ fontSize: 28 }}>Worker</b>
                    <input
                      type="date"
                      className="btn-sm btn-outline-primary"
                      style={{ fontSize: 16, float: "right" }}
                      name="userend"
                      onChange={handleChange}
                    />
                  </div> */}
                </div>

                <div className="card-body">
                  <div
                    className=" align-items-center m-1"
                    style={{ position: "relative" }}
                  >
                    <div>
                      <DataGrid
                        disableColumnFilter
                        disableColumnSelector
                        disableDensitySelector
                        rows={rows3}
                        columns={columns3}
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
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Viewallreport;
