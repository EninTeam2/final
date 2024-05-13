import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Col, Row } from "react-bootstrap";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Icon from "@mui/material/Icon";
import axios from "axios";
import * as Yup from "yup";
import { useFormik } from "formik";
import Header from "../Header";


const validationSchema = Yup.object().shape({
  user_name: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
  roleId: Yup.string().required("Role is required"),
});

const UserView = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const [userData, setUserData] = useState(null);
  const [idvalue, setidvalue] = useState({
    idValue: 0,
  });

  const fetchAllData = async () => {
    try {
      const res = await axios.get("/user");
      setUsers(res.data);
      const res1 = await axios.get("/role");
      setRoles(res1.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchAllData();
  }, []);
  let iddd;
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/user/delete/${id}`);
      setUsers(users.filter((user) => user.Id !== id));
    } catch (error) {
      console.log(error);
    }
  };
  const handleUpdate = async (id) => {
    const res = await axios.get("/user/read/" + id);
    formik.values.user_name = res.data.user_name;
    formik.values.password = "";
    formik.values.roleId = res.data.roleId;
    formik.values.id = id;
    setidvalue(id);
    iddd = id;
    console.log(iddd);
    setOpen(true);
  };
  const handleOpen = () => {
    setOpen(false);
  };
  let roleValue;
  const role = () => {
    roles.map((role) => {
      if (role.Id === formik.values.roleId) {
        roleValue = role.roleName;
      }
    });
  };

  const formik = useFormik({
    initialValues: {
      user_name: "",
      password: "",
      roleId: "",
      id: "",
    },

    validationSchema,
    onSubmit: async (values) => {
      try {
        if (idvalue === 0) {
          const { user_name } = values;
          const userExists = users.some((user) => user.user_name === user_name);

          if (userExists) {
            formik.setErrors({
              user_name: "User name OR roleName already exists.",
            });
            return;
          }
          await axios.post("/user/add", values);
          fetchAllData();
          setOpen(false);
        } else {
          await axios
            .put("/user/update/" + values.id, values)
            .then((res) => console.log(res))
            .catch((err) => console.log(err));
          fetchAllData();
          setOpen(false);
        }
      } catch (error) {
        console.log(error);
      }
    },
  });
  const handleAdd = () => {
    setidvalue(0);
    formik.values.user_name = "";
    formik.values.password = "";
    formik.values.roleId = "";
    setOpen(true);
  };

  role();
  const columns = [
    { field: "Id", headerName: "ID", width: 100 },
    { field: "user_name", headerName: "Username", width: 200 },
    {
      field: "roleId",
      headerName: "Role",
      width: 150,
      valueGetter: (params) =>
        roles.find((role) => role.Id === params)?.roleName || "",
    },
    {
      field: "action",
      headerName: "Action",
      width: 220,
      renderCell: (params) => (
        <>
          <Button
            onClick={() => handleUpdate(params.row.Id)}
            variant="outline-warning"
            className="m-1"
          >
            Update
          </Button>
          <Button
            onClick={() => handleDelete(params.row.Id)}
            variant="outline-danger"
            className="m-1"
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <div className="p-3">
        <Header />
      </div>
      <div className="p-3">
        <div className="content-wrapper">
          <div className="container-xxl flex-grow-1 container-p-y">
            <div>
              <div style={{ float: "right" }}>
                <Icon
                  baseClassName="fas"
                  className="fa-plus-circle"
                  sx={{ fontSize: 40, cursor: "pointer" }}
                  onClick={handleAdd}
                />
              </div>
              <br />
              <br />
              <DataGrid
                rows={users}
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
                getRowId={(row) => row.Id}
              />
            </div>
          </div>
          <div className="content-backdrop fade"></div>
        </div>
      </div>

      <Modal show={open} onHide={handleOpen}>
        <Modal.Header closeButton>
          <Modal.Title>
            {idvalue !== 0 ? "Update Userr" : "Add User"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="m-5" onSubmit={formik.handleSubmit}>
            <Form.Group
              as={Row}
              className="mb-3"
              controlId="formHorizontalUsername"
            >
              <Form.Label column sm={2}>
                Username
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="text"
                  placeholder="Username"
                  name="user_name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.user_name}
                  isInvalid={
                    formik.touched.user_name && formik.errors.user_name
                  }
                  style={{ maxWidth: "300px" }}
                />
                {formik.touched.user_name && formik.errors.user_name && (
                  <div className="text-danger mt-1">
                    {formik.errors.user_name}
                  </div>
                )}
              </Col>
            </Form.Group>
            <Form.Group
              as={Row}
              className="mb-3"
              controlId="formHorizontalPassword"
            >
              <Form.Label column sm={2}>
                Password
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  name="password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  isInvalid={formik.touched.password && formik.errors.password}
                  style={{ maxWidth: "300px" }}
                />
                {formik.touched.password && formik.errors.password && (
                  <div className="text-danger mt-1">
                    {formik.errors.password}
                  </div>
                )}
              </Col>
            </Form.Group>
            {idvalue !== 0 && (
              <Form.Group as={Row} className="m-2">
                <Form.Label column sm={4}>
                  Role
                </Form.Label>
                <Col sm={8}>
                  <Form.Control
                    disabled
                    readOnly
                    value={roleValue}
                  ></Form.Control>
                </Col>
              </Form.Group>
            )}
            <Form.Group
              as={Row}
              className="m-2"
              controlId="formHorizontalEmail"
            >
              <Form.Label column sm={2}>
                {idvalue !== 0 ? "Change Role" : "Role"}
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  as="select"
                  name="roleId"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.roleId && formik.errors.roleId}
                  style={{ maxWidth: "300px" }}
                >
                  <option value="">Select Role</option>
                  {roles.map((role) => (
                    <option key={role.Id} value={role.Id}>
                      {role.roleName}
                    </option>
                  ))}
                </Form.Control>
                {formik.touched.roleId && formik.errors.roleId && (
                  <div className="text-danger mt-1">{formik.errors.roleId}</div>
                )}
              </Col>
              <Col md="auto">
                <Button variant="outline-success" type="submit">
                  Add
                </Button>
              </Col>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UserView;
