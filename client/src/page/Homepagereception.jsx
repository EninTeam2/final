import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Header from "../Header";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Button, Modal, Form, Col, Row } from "react-bootstrap";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";


const Homepagereception = () => {
  const [datas, setData] = useState([]);
  const [users, setUser] = useState([]);
  const [requests, setRequest] = useState([]);
  const [sales, setSale] = useState([]);
  const [requestrefs, setRequestRef] = useState([]);
  const [salerefs, setSaleRef] = useState([]);
  const [units, setUnits] = useState([]);
  const [types, setTypes] = useState([]);
  const [roles, setRoles] = useState([]);
  const [roleId, setRoleId] = useState();
  const [open, setOpen] = useState(false);
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [addItemModalOpen, setAddItemModalOpen] = useState(false);

  const handleOpen = () => {
    setOpen(false);
  };
  const handleAdd = () => {
    setOpen(true);
  };
  const handleAddUser = () => {
    setAddUserModalOpen(true);
  };

  const handleAddItem = () => {
    setAddItemModalOpen(true);
  };
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
  const validationSchema1 = Yup.object().shape({
    user_name: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
    roleId: Yup.string().required("Role is required"),
  });
  const validationSchema2 = Yup.object().shape({
    itemName: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Item Name Required")
      .matches(/^[a-zA-Z ]*$/, "Don't Use Number"),
    price: Yup.number()
      .min(1, "Too Short!")
      .max(1000000, "Too Long!")
      .required("Price Required"),
    typeId: Yup.string().required("Type Required"),
    unitId: Yup.string().required("Unit Required"),
  });
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
        setOpen(false);
      } catch (error) {
        console.error("Failed");
      }
      naviget("/reception");
    },
  });
  const formikUser = useFormik({
    initialValues: {
      user_name: "",
      password: "",
      roleId: "3",
    },
    validationSchema1,
    onSubmit: async (values) => {
      try {
        await axios.post("/user/add", values);
        fetchData();
        setAddUserModalOpen(false);
        formikUser.resetForm();
      } catch (error) {
        console.error("Failed to add user");
      }
    },
  });
  const formikItem = useFormik({
    initialValues: {
      itemName: "",
      price: "",
      typeId: "",
      unitId: "",
    },
    validationSchema2,
    onSubmit: async (values) => {
      try {
        console.log("rrrrrrrrrr", values);
        await axios.post("/item/add", values);
        fetchData();
        setAddItemModalOpen(false);
        formikItem.resetForm();
      } catch (error) {
        console.error("Failed to add item");
      }
    },
  });

  useEffect(() => {
    const allcustomer = async () => {
      try {
        const role = (await axios.get("/validity")).data.roleId;
        setRoleId(role);
        const [res1, res2, res3, res4, res5, res6] = await Promise.all([
          axios.get("/customer"),
          axios.get("/user"),
          axios.get("/request"),
          axios.get("/sales"),
          axios.get("/request_ref"),
          axios.get("/sales_ref"),
        ]);
        setData(res1.data);
        const res20 = res2.data.filter((res0) => res0.roleId === 3);
        setUser(res20);
        const res30 = res3.data.filter((res0) => res0.statusId === 4);
        setRequest(res30);
        setSale(res4.data);
        setRequestRef(res5.data);
        setSaleRef(res6.data);
      } catch (error) {
        console.log(error);
      }
    };
    allcustomer();
  }, []);
  const fetchData = async () => {
    try {
      const [res7, res8, res9] = await Promise.all([
        axios.get("/unit"),
        axios.get("/role"),
        axios.get("/type"),
      ]);
      setUnits(res7.data);
      setRoles(res8.data);
      setTypes(res9.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const rows = datas.map((data) => {
    const reqs = requestrefs.findLast((req) => req.customerId === data.Id) || 0;
    const sale =
      salerefs.find(
        (sal) => reqs.Id === sal.requestRefId && sal.totalprice > 0
      ) || 0;
    const cust = {
      custId: data.Id,
      reqId: sale !== 0 || !reqs ? 0 : reqs.Id,
    };
    return {
      id: data.Id,
      fullname: `${data.firstName} ${data.lastName}`,
      phone: data.phone_no,
      action: cust,
    };
  });
  const columns = [
    { field: "id", headerName: "Id", width: 100 },
    { field: "fullname", headerName: "Full Name", width: 150 },
    { field: "phone", headerName: "Phone Number", width: 150 },
    {
      field: "action",
      headerName: "Action",
      width: 220,
      renderCell: (params) => (
        <>
          {params.row.action.reqId === 0 && (
            <Link className="" to={`/request/${params.row.action.custId}`}>
              <i
                class="bx bxs-plus-square fa-3x"
                style={{ color: "green" }}
              ></i>
            </Link>
          )}
          {params.row.action.reqId !== 0 && (
            <Link
              className="btn btn-sm rounded-pill btn-info m-1"
              to={`/editrequest/${params.row.action.reqId}`}
            >
              <b>Edit</b>
            </Link>
          )}
        </>
      ),
    },
  ];
  const columns1 = [
    { field: "id", headerName: "Id", width: 100 },
    { field: "username", headerName: "Username", width: 100 },
    { field: "totalorder", headerName: "Total Order", width: 100 },
  ];
  const rows1 = users.map((user) => {
    const count = requests
      .map((req) => {
        return user.Id === req.userId ? 1 : 0;
      })
      .reduce((acc, crr) => acc + crr, 0);

    return {
      id: user.Id,
      username: user.user_name,
      totalorder: count,
    };
  });

  return (
    <div className="">
      <div className="p-3">
        <Header />
      </div>
      <div className="p-3">
        <div className="content-wrapper">
          <div className="container-xxl flex-grow-1 container-p-y">
            <h4 class="fw-bold py-3 mb-4">
              <span class="text-muted fw-light">Reception/</span> Home
            </h4>

            <div className="d-flex justify-content-start">
              <Link onClick={handleAdd} className="mx-2">
                <h5>
                  Add Customer <i className="bx bxs-plus-circle fa-2x"></i>
                </h5>
              </Link>
              <Link onClick={handleAddUser} className="mx-2">
                <h5>
                  Add User <i className="bx bxs-plus-circle fa-2x"></i>
                </h5>
              </Link>
              <Link onClick={handleAddItem} className="mx-2">
                <h5>
                  Add Item <i className="bx bxs-plus-circle fa-2x"></i>
                </h5>
              </Link>
            </div>

            <div className="row">
              <div className="col-md-10 col-lg-8 col-xl-8 order-0 mb-4">
                <div className="card">
                  <div className="navbar-nav align-items-center card-header m-2"></div>

                  <div className="table-responsive text-nowrap">
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
              </div>
              <div className="col-md-6 col-lg-5 col-xl-4 order-1 mb-4">
                <div className="navbar-nav align-items-center card-header m-2">
                  <div className="nav-item d-flex align-items-center">
                    <h5>Workers</h5>
                  </div>
                </div>
                <div className="table-responsive text-nowrap">
                  <DataGrid
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

          <div className="content-backdrop fade"></div>
        </div>
      </div>
      <Modal show={open} onHide={handleOpen}>
        <Modal.Header closeButton>
          <Modal.Title>Add Customer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={formik.handleSubmit}>
            <div className="card mb-4">
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
        </Modal.Body>
      </Modal>

      <Modal show={addUserModalOpen} onHide={() => setAddUserModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={formikUser.handleSubmit}>
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                name="user_name"
                value={formikUser.values.user_name}
                onChange={formikUser.handleChange}
                onBlur={formikUser.handleBlur}
                isInvalid={
                  formikUser.touched.user_name && formikUser.errors.user_name
                }
              />
              {formikUser.touched.user_name && formikUser.errors.user_name && (
                <Form.Control.Feedback type="invalid">
                  {formikUser.errors.user_name}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                name="password"
                value={formikUser.values.password}
                onChange={formikUser.handleChange}
                onBlur={formikUser.handleBlur}
                isInvalid={
                  formikUser.touched.password && formikUser.errors.password
                }
              />
              {formikUser.touched.password && formikUser.errors.password && (
                <Form.Control.Feedback type="invalid">
                  {formikUser.errors.password}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Form.Group controlId="formRole">
              <Form.Label>Role</Form.Label>
              <Form.Control
                type="text"
                value={roles.find((role) => role.Id === 3)?.roleName || ""}
                readOnly
                plaintext
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Add User
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={addItemModalOpen} onHide={() => setAddItemModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div>
              <div>
                <div>
                  <Form onSubmit={formikItem.handleSubmit} className="m-5">
                    <Form.Group controlId="formitemName">
                      <Form.Label>Item Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter item name"
                        name="itemName"
                        value={formikItem.values.itemName}
                        onChange={formikItem.handleChange}
                        onBlur={formikItem.handleBlur}
                        isInvalid={
                          formikItem.touched.itemName &&
                          formikItem.errors.itemName
                        }
                      />
                      {formikItem.touched.itemName &&
                        formikItem.errors.itemName && (
                          <Form.Control.Feedback type="invalid">
                            {formikItem.errors.itemName}
                          </Form.Control.Feedback>
                        )}
                    </Form.Group>

                    <Form.Group controlId="formitemName">
                      <Form.Label>Price</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter price"
                        name="price"
                        value={formikItem.values.price}
                        onChange={formikItem.handleChange}
                        onBlur={formikItem.handleBlur}
                        isInvalid={
                          formikItem.touched.price && formikItem.errors.price
                        }
                      />
                      {formikItem.touched.price && formikItem.errors.price && (
                        <Form.Control.Feedback type="invalid">
                          {formikItem.errors.price}
                        </Form.Control.Feedback>
                      )}
                    </Form.Group>

                    <Form.Group as={Row} className="m-2">
                      <Form.Label column sm={4}>
                        Type
                      </Form.Label>
                      <Col sm={8}>
                        <Form.Select
                          name="typeId"
                          onChange={formikItem.handleChange}
                          onBlur={formikItem.handleBlur}
                          isInvalid={
                            formikItem.touched.typeId &&
                            formikItem.errors.typeId
                          }
                        >
                          <option value="">Select Type</option>
                          {types.map((type) => (
                            <option value={type.Id}>{type.typeName}</option>
                          ))}
                        </Form.Select>
                        {formikItem.touched.typeId &&
                          formikItem.errors.typeId && (
                            <div className="text-danger mt-1">
                              {formikItem.errors.typeId}
                            </div>
                          )}
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="m-2">
                      <Form.Label column sm={4}>
                        Unit
                      </Form.Label>
                      <Col sm={8}>
                        <Form.Select
                          name="unitId"
                          onChange={formikItem.handleChange}
                          onBlur={formikItem.handleBlur}
                          isInvalid={
                            formikItem.touched.unitId &&
                            formikItem.errors.unitId
                          }
                        >
                          <option value="">Select Unit</option>
                          {units.map((unit) => (
                            <option value={unit.Id}>{unit.unitName}</option>
                          ))}
                        </Form.Select>
                        {formikItem.touched.unitId &&
                          formikItem.errors.unitId && (
                            <div className="text-danger mt-1">
                              {formikItem.errors.unitId}
                            </div>
                          )}
                      </Col>
                    </Form.Group>
                    <Row className="justify-content-md-center m-5">
                      <Col md="auto">
                        <Button type="submit" variant="outline-success">
                          Submit
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};
export default Homepagereception;
