import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../Header";
import { Button } from "react-bootstrap";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Alert } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const validationSchema = Yup.object().shape({
  totalprice: Yup.number()
    .max(100000, "It is to much!")
    .min(0, "It is to Low!")
    .required("Required"),
});

const UpdateSale = () => {
  const [salesRef, setSalesRef] = useState([]);
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [remainprice, setRemainprice] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const salesRefResponse = await axios.get("/sales_ref/read/" + id);
        setSalesRef(salesRefResponse.data);
        const remain = await axios.get("/remain_price");
        const res1 = remain.data.filter(
          (res) => res.salesRefId === parseInt(id)
        );
        setRemainprice(res1);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);
  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "paidPrice", headerName: "Paid Price", width: 100 },
    { field: "remainPrice", headerName: "Remain Price", width: 100 },
    { field: "date", headerName: "Date", width: 100 },
    { field: "time", headerName: "Time", width: 100 },
  ];
  const rows = remainprice.map((rem) => {
    const date = new Date(rem.date);
    return {
      id: rem.Id,
      paidPrice: rem.paidprice,
      remainPrice: rem.remainprice,
      date: `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`,
      time: `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`,
    };
  });
  const navigate = useNavigate();
  const handleSubmit = async (values) => {
    try {
      let remainprice = 0,
        statusId = 0;
      if (values.totalprice > salesRef.remainprice) {
        setOpen(true);
      } else {
        if (salesRef.remainprice === values.totalprice) {
          remainprice = 0;
          statusId = 1;
        } else {
          remainprice = salesRef.remainprice - values.totalprice;
          statusId = 6;
        }
        await axios.put(`/sales_ref/update/${id}`, {
          totalprice: parseInt(values.totalprice + salesRef.totalprice),
          remainprice: parseInt(remainprice),
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
      {salesRef && (
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
              Please Insert Less Than or Equal To {salesRef.remainprice}
            </Alert>
          </center>

          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
              <div
                className="row"
                style={{
                  padding: "50px",
                  alignItems: "center",
                }}
              >
                <div
                  className="card mb-4 col-md-9"
                  style={{
                    maxHeight: "600px",
                    width: "560px",
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
                    Total Price Use{" "}
                    <span style={{ float: "right" }}>
                      {salesRef.totalprice + salesRef.remainprice}
                    </span>
                  </h5>
                  <div className="card-body table-responsive">
                    <div className="mb-3">
                      <DataGrid rows={rows} columns={columns} width={500} />
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
                            Remain Price
                          </label>
                          <input
                            type="text"
                            readOnly
                            className="form-control-plaintext"
                            id="exampleFormControlReadOnlyInputPlain1"
                            value={salesRef.remainprice}
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
export default UpdateSale;
