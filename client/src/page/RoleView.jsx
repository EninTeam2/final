import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Col, Row } from "react-bootstrap";
import axios from "axios";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Icon from "@mui/material/Icon";
import * as Yup from "yup";
import { useFormik } from "formik";
import Header from "../Header";


const validationSchema = Yup.object().shape({
  roleName: Yup.string().required("Role Name is required"),
});

const RoleView = () => {
  const [roles, setRoles] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [RoleData, setRoleData] = useState(null);

  const fetchAllRoles = async () => {
    try {
      const res = await axios.get("/role");
      setRoles(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllRoles();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete("/role/delete/" + id);
      setRoles(roles.filter((role) => role.Id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const openUpdateModal = async (id) => {
    setSelectedRoleId(id);
    try {
      const roleResponse = await axios.get(`/role/read/${id}`);
      setRoleData(roleResponse.data);
      formikUpdateRole.setValues({ roleName: roleResponse.data.roleName });
      setIsUpdateModalOpen(true);

      console.log("Selected Role Data:", roleResponse.data);
    } catch (error) {
      console.error(error);
    }
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedRoleId(null);
    setRoleData(null);
  };

  const handleAddRole = async (values) => {
    try {
      if (!values.roleName) {
        formikAddRole.setErrors({ roleName: "Role name is required." });
        return;
      }

      const roleExists = roles.some(
        (role) => role.roleName === values.roleName
      );
      if (roleExists) {
        formikAddRole.setErrors({ roleName: "Role name already exists." });
        return;
      }

      await axios.post("/role/add", values);
      setIsAddModalOpen(false);
      fetchAllRoles();
      formikAddRole.resetForm();
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateRole = async (updateRoleName) => {
    try {
      if (!updateRoleName) {
        formikUpdateRole.setErrors({ roleName: "Role name is required." });
        return;
      }

      const roleExists = roles.some(
        (role) => role.roleName === updateRoleName && role.Id !== selectedRoleId
      );
      if (roleExists) {
        formikUpdateRole.setErrors({ roleName: "Role name already exists." });
        return;
      }

      await axios.put(`/role/update/${selectedRoleId}`, {
        roleName: updateRoleName,
      });
      setIsUpdateModalOpen(false);
      fetchAllRoles();
      formikUpdateRole.resetForm();
    } catch (error) {
      console.log(error);
    }
  };

  const formikAddRole = useFormik({
    initialValues: {
      roleName: "",
    },
    validationSchema,
    onSubmit: (values) => {
      handleAddRole(values);
    },
  });

  const formikUpdateRole = useFormik({
    initialValues: {
      roleName: RoleData?.roleName || "",
    },
    validationSchema,
    onSubmit: (values) => {
      handleUpdateRole(values.roleName);
    },
  });

  const columns = [
    { field: "Id", headerName: "ID", width: 100 },
    { field: "roleName", headerName: "Role", width: 200 },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <div>
          <Button
            onClick={() => openUpdateModal(params.row.Id, params.row)}
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
        </div>
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
                  onClick={openAddModal}
                />
              </div>
              <br />
              <br />
              <DataGrid
                rows={roles}
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

      <Modal show={isAddModalOpen} onHide={closeAddModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Role</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={formikAddRole.handleSubmit}>
            <Form.Group
              as={Row}
              className="m-2"
              controlId="formHorizontalUsername"
            >
              <Form.Label column sm={2}>
                Role Name
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="text"
                  placeholder="Role Name"
                  {...formikAddRole.getFieldProps("roleName")}
                  isInvalid={
                    formikAddRole.touched.roleName &&
                    formikAddRole.errors.roleName
                  }
                  style={{ maxWidth: "300px" }}
                />
                <Form.Control.Feedback type="invalid">
                  {formikAddRole.errors.roleName}
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
            <Row className="justify-content-md-center m-5">
              <Col md="auto">
                <Button variant="outline-success" type="submit">
                  Submit
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={isUpdateModalOpen} onHide={closeUpdateModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update Role</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={formikUpdateRole.handleSubmit}>
            <Form.Group
              as={Row}
              className="m-2"
              controlId="formHorizontalUsername"
            >
              <Form.Label column sm={2}>
                Role Name
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="text"
                  placeholder="Role Name"
                  {...formikUpdateRole.getFieldProps("roleName")}
                  isInvalid={
                    formikUpdateRole.touched.roleName &&
                    formikUpdateRole.errors.roleName
                  }
                  style={{ maxWidth: "300px" }}
                />
                <Form.Control.Feedback type="invalid">
                  {formikUpdateRole.errors.roleName}
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
            <Row className="justify-content-md-center m-5">
              <Col md="auto">
                <Button variant="outline-success" type="submit">
                  Update
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default RoleView;
