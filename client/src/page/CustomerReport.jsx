import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../Header";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Modal } from "react-bootstrap";


const CustomerReport = () => {
  const [sales, setSale] = useState([]);
  const [salesref, setSalesref] = useState([]);
  const [item, setItem] = useState([]);
  const [customer, setCustomer] = useState([]);
  const [newsalesref, setNewSalesRef] = useState([]);
  const [osdate, setOsdate] = useState({
    custstart: new Date(),
    custend: new Date(),
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const alldataview = async () => {
      try {
        const [res1, res5, res6, res7] = await Promise.all([
          axios.get("/sales"),
          axios.get("/item"),
          axios.get("/customer"),
          axios.get("/sales_ref"),
        ]);
        setSale(res1.data);
        setItem(res5.data);
        setCustomer(res6.data);
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
  const handleOpen = () => {
    setOpen(false);
  };
  const handlRowClick = (params) => {
    const newcustomer = salesref.filter((sale) => {
      const date = new Date(sale.date);
      return (
        (date.getFullYear() > osdate.custstart.getFullYear() &&
          date.getFullYear() < osdate.custend.getFullYear()) ||
        (date.getFullYear() >= osdate.custstart.getFullYear() &&
          date.getMonth() > osdate.custstart.getMonth() &&
          date.getFullYear() <= osdate.custend.getFullYear() &&
          date.getMonth() < osdate.custend.getMonth()) ||
        (date.getFullYear() >= osdate.custstart.getFullYear() &&
          date.getMonth() >= osdate.custstart.getMonth() &&
          date.getDate() >= osdate.custstart.getDate() &&
          date.getFullYear() <= osdate.custend.getFullYear() &&
          date.getMonth() <= osdate.custend.getMonth() &&
          date.getDate() <= osdate.custend.getDate() &&
          sale.customerId === parseInt(params.row.id))
      );
    });
    setNewSalesRef(newcustomer);
    setOpen(true);
  };
  const columns1 = [
    { field: "id", headerName: "Id", width: 80 },
    { field: "fullname", headerName: "Full Name", width: 180 },
    { field: "phone", headerName: "Phone No", width: 160 },
    { field: "item", headerName: "Total Order", width: 90 },
    { field: "price", headerName: "Total Price", width: 180 },
  ];
  const rows1 = customer.map((cust) => {
    let totalprice = 0;
    const count = salesref
      .map((saleref) => {
        const date = new Date(saleref.date);
        return (date.getFullYear() > osdate.custstart.getFullYear() &&
          date.getFullYear() < osdate.custend.getFullYear()) ||
          (date.getFullYear() >= osdate.custstart.getFullYear() &&
            date.getMonth() > osdate.custstart.getMonth() &&
            date.getFullYear() <= osdate.custend.getFullYear() &&
            date.getMonth() < osdate.custend.getMonth()) ||
          (date.getFullYear() >= osdate.custstart.getFullYear() &&
            date.getMonth() >= osdate.custstart.getMonth() &&
            date.getDate() >= osdate.custstart.getDate() &&
            date.getFullYear() <= osdate.custend.getFullYear() &&
            date.getMonth() <= osdate.custend.getMonth() &&
            date.getDate() <= osdate.custend.getDate() &&
            cust.Id === saleref.customerId)
          ? sales
              .map((sale) => {
                if (
                  sale.salesRefId === saleref.Id &&
                  cust.Id === saleref.customerId
                ) {
                  totalprice += sale.price;
                }

                return sale.salesRefId === saleref.Id &&
                  cust.Id === saleref.customerId
                  ? 1
                  : 0;
              })
              .reduce((acc, crr) => acc + crr, 0)
          : 0;
      })
      .reduce((acc, crr) => acc + crr, 0);
    return {
      id: cust.Id,
      fullname: `${cust.firstName} ${cust.lastName}`,
      phone: cust.phone_no,
      item: count,
      price: totalprice,
    };
  });
  const columns2 = [
    { field: "id", headerName: "Id", width: 80 },
    { field: "item", headerName: "Total Order", width: 150 },
    { field: "price", headerName: "Total Price", width: 130 },
    { field: "date", headerName: "Date", width: 130 },
    { field: "time", headerName: "Time", width: 100 },
  ];
  const rows2 = newsalesref.map((saleref) => {
    let totalprice = 0;
    const count = sales
      .map((sale) => {
        if (sale.salesRefId === saleref.Id) {
          totalprice += sale.price;
        }
        return sale.salesRefId === saleref.Id ? 1 : 0;
      })
      .reduce((acc, crr) => acc + crr, 0);
    const date = new Date(saleref.date);
    return {
      id: saleref.Id,
      item: count,
      price: totalprice,
      date: `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`,
      time: `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`,
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
          <div className="row p-5">
            <center>
              {" "}
              <div
                className="col"
                style={{ maxWidth: "740px", maxHeight: "800px" }}
              >
                <div className="card h-100">
                  <div className="card-header">
                    <div
                      className="row"
                      style={{ fontSize: 20, color: "rgb(1, 81, 255)" }}
                    >
                      <div className="col">
                        <b>Start Date</b>
                      </div>
                      <div className="col"></div>
                      <div className="col">
                        <b>End Date</b>
                      </div>
                    </div>
                    <div
                      className="text-center"
                      style={{ color: "rgb(1, 81, 255)" }}
                    >
                      <input
                        type="date"
                        className="btn-sm btn-outline-primary"
                        style={{ fontSize: 14, float: "left" }}
                        name="custstart"
                        onChange={handleChange}
                      />
                      <b style={{ fontSize: 20 }}>Customer</b>
                      <input
                        type="date"
                        className="btn-sm btn-outline-primary"
                        style={{ fontSize: 16, float: "right" }}
                        name="custend"
                        onChange={handleChange}
                      />
                    </div>
                    <div
                      className="row"
                      style={{ fontSize: 20, color: "rgb(1, 81, 255)" }}
                    >
                      <div className="col">
                        <b>{`${osdate.custstart.getFullYear()}/${
                          osdate.custstart.getMonth() + 1
                        }/${osdate.custstart.getDate()}`}</b>
                      </div>
                      <div className="col"></div>
                      <div className="col">-----</div>
                      <div className="col"></div>
                      <div className="col">
                        <b>{`${osdate.custend.getFullYear()}/${
                          osdate.custend.getMonth() + 1
                        }/${osdate.custend.getDate()}`}</b>
                      </div>
                    </div>
                  </div>

                  <div className="card-body">
                    <div
                      className="align-items-center m-1"
                      style={{ position: "relative" }}
                    >
                      <div>
                        <DataGrid
                          onRowClick={handlRowClick}
                          disableColumnFilter
                          disableColumnSelector
                          disableDensitySelector
                          rows={rows1}
                          columns={columns1}
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
            </center>

            <Modal show={open} onHide={handleOpen} size="lg">
              <Modal.Header closeButton>
                <Modal.Title></Modal.Title>
              </Modal.Header>
              <Modal.Body>
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
              </Modal.Body>
            </Modal>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerReport;
