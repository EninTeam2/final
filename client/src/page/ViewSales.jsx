import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../Header";
import { Button } from "react-bootstrap";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Alert } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

const validationSchema = Yup.object().shape({
  totalprice: Yup.number()
    .max(100000, "It is to much!")
    .min(0, "It is to Low!")
    .required("Required"),
});

const ViewSales = () => {
  const [sales, setSales] = useState([]);
  const [salesRef, setSalesRef] = useState([]);
  const [item, setItem] = useState([]);
  const { id } = useParams();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const salesRefResponse = await axios.get("/sales_ref/read/" + id);
        setSalesRef(salesRefResponse.data);
        if (salesRef) {
          const [res1, res2] = await Promise.all([
            axios.get("/sales"),
            axios.get("/item"),
          ]);
          const res0 = res1.data.filter((res) => {
            return res.salesRefId === parseInt(id);
          });
          setSales(res0);
          setItem(res2.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);
  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "itemName", headerName: "Item Name", width: 100 },
    { field: "price", headerName: "Price", width: 100 },
  ];

  const rows = sales.map((sale) => {
    const items = item.find((i) => i.Id === sale.itemId);
    return {
      id: sale.Id,
      itemName: items.itemName,
      price: sale.price,
    };
  });

  const navigate = useNavigate();
  const handleSubmit = async (values) => {
    try {
      const totalprice = sales
        .map((s) => s.price)
        .reduce((acc, crr) => acc + crr, 0);
      let remainprice = 0,
        statusId = 0;
      if (values.totalprice > totalprice) {
        setOpen(true);
      } else {
        if (totalprice === values.totalprice) {
          remainprice = 0;
          statusId = 1;
        } else {
          remainprice = totalprice - values.totalprice;
          statusId = 6;
        }
        await axios.put(`/sales_ref/update/${id}`, {
          totalprice: values.totalprice,
          remainprice: remainprice,
          statusId: statusId,
        });
        await axios.post(`/remain_price/add`, {
          salesRefId: id,
          statusId: statusId,
          remainprice: remainprice,
          paidprice: values.totalprice,
        });
        navigate(`/viewuser`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="">
      <div className="p-3">
        <Header />
      </div>{" "}
      {item && (
        <div className="p-3">
          <center>
            {" "}
            <Alert
              hidden={!open}
              severity="warning"
              onClose={() => {
                setOpen(false);
              }}
              style={{ textAlign: "center", maxWidth: "500px" }}
            >
              You Insert Large Amount of Money !!!
              <br />
              Please Insert Less Than or Equal To{" "}
              {sales.map((s) => s.price).reduce((acc, crr) => acc + crr, 0)}
            </Alert>
          </center>

          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
              <div
                className="row"
                style={{
                  background:
                    "linear-gradient(45deg, rgba(27,133,27,1) 0%, rgba(0,190,201,1) 100%)",
                  borderTopLeftRadius: 30,
                  borderTopRightRadius: 30,
                  borderBottomRightRadius: 30,
                  borderBottomLeftRadius: 30,
                  padding: "50px",
                }}
              >
                <div
                  className="card mb-4 col-md-4"
                  style={{
                    maxHeight: "600px",
                    minWidth: "450px",
                    marginInlineEnd: "50px",
                  }}
                >
                  <h5
                    className="card-header"
                    style={{
                      position: "sticky",
                      backgroundColor: "blue",
                      top: "0",
                      color: "white",
                    }}
                  >
                    Total Item Use{" "}
                    <span style={{ float: "right" }}>{sales.length}</span>
                  </h5>
                  <div className="card-body table-responsive">
                    <div className="mb-3">
                      <DataGrid rows={rows} columns={columns} />
                    </div>
                  </div>
                </div>
                <Formik
                  initialValues={{
                    totalprice: "",
                  }}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ handleSubmit, handleChange, values }) => (
                    <form
                      className="card mb-4 col-md-6"
                      style={{
                        maxHeight: "400px",
                      }}
                      onSubmit={handleSubmit}
                    >
                      <h5
                        className="card-header"
                        style={{ color: "whitesmoke", backgroundColor: "blue" }}
                      >
                        Form Controls
                      </h5>
                      <div className="card-body">
                        <div className="mb-3" style={{ color: "black" }}>
                          <label
                            htmlFor="exampleFormControlInput1"
                            className="form-label"
                          >
                            Enter the Price
                          </label>
                          <input
                            className="form-control"
                            id="exampleFormControlInput1"
                            placeholder="12345"
                            type="number"
                            name="totalprice"
                            onChange={handleChange}
                            value={values.totalprice}
                          />
                          <ErrorMessage
                            name="totalprice"
                            component="div"
                            className="text-danger"
                          />
                        </div>
                        <div className="mb-3">
                          <label
                            htmlFor="exampleFormControlReadOnlyInputPlain1"
                            className="form-label"
                          >
                            Total Price
                          </label>
                          <input
                            type="text"
                            readOnly
                            className="form-control-plaintext"
                            id="exampleFormControlReadOnlyInputPlain1"
                            value={sales
                              .map((s) => s.price)
                              .reduce((acc, crr) => acc + crr, 0)}
                          />
                        </div>
                        <Button type="submit" variant="outline-success">
                          Submit
                        </Button>
                      </div>
                    </form>
                  )}
                </Formik>
              </div>
            </div>

            <div className="content-backdrop fade"></div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ViewSales;
