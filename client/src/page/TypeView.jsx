import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Modal, Form, Col, Row } from "react-bootstrap";
import Header from "../Header";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Icon from "@mui/material/Icon";
import * as Yup from "yup";
import { useFormik } from "formik";


const validationSchema = Yup.object().shape({
  typeName: Yup.string().required("Type Name is required"),
});

const TypeView = () => {
  const [types, setType] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedTypeId, setSelectedTypeId] = useState(null);
  const [TypeData, setTypeData] = useState(null);

  const fetchalltype = async () => {
    try {
      const res = await axios.get("/type");
      setType(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchalltype();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete("/type/delete/" + id);
      setType(types.filter((type) => type.Id !== id));
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
    setSelectedTypeId(id);
    try {
      const typeResponse = await axios.get(`/type/read/${id}`);
      setTypeData(typeResponse.data);
      formikUpdateType.setValues({ typeName: typeResponse.data.typeName });
      setIsUpdateModalOpen(true);
      console.log("Selected Type Data:", typeResponse.data);
    } catch (error) {
      console.error(error);
    }
  };
  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedTypeId(null);
    setTypeData(null);
  };

  const handleAddType = async (values) => {
    try {
      if (!values.typeName) {
        formikAddType.setErrors({ typeName: "Type name is required." });
        return;
      }

      const typeExists = types.some(
        (type) => type.typeName === values.typeName
      );
      if (typeExists) {
        formikAddType.setErrors({ typeName: "Type name already exists." });
        return;
      }

      await axios.post("/type/add", values);
      setIsAddModalOpen(false);
      fetchalltype();
      formikAddType.resetForm();
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateType = async (updateTypeName) => {
    try {
      if (!updateTypeName) {
        formikUpdateType.setErrors({ typeName: "Type name is required." });
        return;
      }

      const typeExists = types.some(
        (type) => type.typeName === updateTypeName && type.Id !== selectedTypeId
      );
      if (typeExists) {
        formikUpdateType.setErrors({ typeName: "Type name already exists." });
        return;
      }

      await axios.put(`/type/update/${selectedTypeId}`, {
        typeName: updateTypeName,
      });
      setIsUpdateModalOpen(false);
      fetchalltype();
      formikUpdateType.resetForm();
    } catch (error) {
      console.log(error);
    }
  };

  const formikAddType = useFormik({
    initialValues: {
      typeName: "",
    },
    validationSchema,
    onSubmit: (values) => {
      handleAddType(values);
    },
  });

  const formikUpdateType = useFormik({
    initialValues: {
      typeName: TypeData?.typeName || "",
    },
    validationSchema,
    onSubmit: (values) => {
      handleUpdateType(values.typeName);
    },
  });

  const columns = [
    { field: "Id", headerName: "ID", width: 100 },
    { field: "typeName", headerName: "Type", width: 200 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      sortable: false,
      filterable: false,
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
                rows={types}
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
          <Modal.Title>Add Type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={formikAddType.handleSubmit}>
            <Form.Group
              as={Row}
              className="m-2"
              controlId="formHorizontalUsername"
            >
              <Form.Label column sm={2}>
                Type Name
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="text"
                  placeholder="Type Name"
                  {...formikAddType.getFieldProps("typeName")}
                  isInvalid={
                    formikAddType.touched.typeName &&
                    formikAddType.errors.typeName
                  }
                  style={{ maxWidth: "300px" }}
                />
                <Form.Control.Feedback type="invalid">
                  {formikAddType.errors.typeName}
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
          <Modal.Title>Update Type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={formikUpdateType.handleSubmit}>
            <Form.Group
              as={Row}
              className="m-2"
              controlId="formHorizontalUsername"
            >
              <Form.Label column sm={2}>
                Type Name
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="text"
                  placeholder="Type Name"
                  {...formikUpdateType.getFieldProps("typeName")}
                  isInvalid={
                    formikUpdateType.touched.typeName &&
                    formikUpdateType.errors.typeName
                  }
                  style={{ maxWidth: "300px" }}
                />
                <Form.Control.Feedback type="invalid">
                  {formikUpdateType.errors.typeName}
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
export default TypeView;
