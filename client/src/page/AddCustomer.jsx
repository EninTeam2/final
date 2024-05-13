import React from "react";
import axios from "axios";
import Header from "../Header";
import { Button } from "react-bootstrap";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";


const validationSchema = Yup.object().shape({
  phone_no: Yup.string().min(9, "Too Short!").max(10, "Too Long!"),
  firstName: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required")
    .matches(/^[a-zA-Z ]*$/, "Do Not Use Number"),
  lastName: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required")
    .matches(/^[a-zA-Z ]*$/, "Do Not Use Number"),
});

const AddCustomer = () => {
  const naviget = useNavigate();
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      phone_no: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log(values);
      try {
        await axios
          .post("/customer/add", values)
          .then((res) => console.log(res));
      } catch (error) {
        console.error("Failed");
      }
      naviget("/reception");
    },
  });

  return (
    <div className="">
      <div className="p-3">
        <Header />
      </div>{" "}
      <div className="p-3">
        {" "}
        <div className="content-wrapper">
          <div className="container-xxl flex-grow-1 container-p-y">
            <form onSubmit={formik.handleSubmit}>
              <div className="card mb-4">
                <h5 className="card-header">New Customer</h5>
                <div className="card-body">
                  <div className="mb-3">
                    <label
                      htmlFor="exampleFormControlInput1"
                      className="form-label"
                    >
                      Firstname
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="exampleFormControlInput1"
                      placeholder="first name"
                      name="firstName"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.number}
                    />
                    {formik.touched.firstName && formik.errors.firstName ? (
                      <span style={{ color: "red" }}>
                        {formik.errors.firstName}
                      </span>
                    ) : null}
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="exampleFormControlInput1"
                      className="form-label"
                    >
                      Lastname
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="exampleFormControlInput1"
                      placeholder="lastname"
                      name="lastName"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.number}
                    />
                    {formik.touched.lastName && formik.errors.lastName ? (
                      <span style={{ color: "red" }}>
                        {formik.errors.lastName}
                      </span>
                    ) : null}
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="exampleFormControlInput1"
                      className="form-label"
                    >
                      Phone Number
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="exampleFormControlInput1"
                      placeholder="0987654321"
                      name="phone_no"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.number}
                    />
                    {formik.touched.phone_no && formik.errors.phone_no ? (
                      <span style={{ color: "red" }}>
                        {formik.errors.phone_no}
                      </span>
                    ) : null}
                  </div>
                  <Button type="submit" variant="outline-success">
                    Submit
                  </Button>
                </div>
              </div>
            </form>
          </div>

          <div className="content-backdrop fade"></div>
        </div>
      </div>
    </div>
  );
};

export default AddCustomer;
