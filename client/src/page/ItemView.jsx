import axios from "axios";
import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Icon from "@mui/material/Icon";
import { Form, Col, Row, Button, Modal } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import Header from "../Header";


const validationSchema1 = Yup.object().shape({
  typeName: Yup.string().required("Type Name is required"),
});
const validationSchema2 = Yup.object().shape({
  unitName:Yup.string().required("Unit Name is required"),
});

const ItemView = () => {
  const [items, setItems] = useState([]);
  const [types, setTypes] = useState([]);
  const [units, setUnits] = useState([]);
  const [onetype, setOneType] = useState([]);
  const [oneunit, setOneUnit] = useState([]);
  const [open, setOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddModalOpenU, setIsAddModalOpenU] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);


  const [isPopupOpen, setIsPopupOpen] = useState({
    addItem: false,
    updateItem: false,
    viewItem: true,
  });
  const [idvalue, setidvalue] = useState(0);

  const openItemPopup = () => {
    console.log(isPopupOpen.viewItem);
    setIsPopupOpen((prev) => ({ ...prev, addItem: true, viewItem: false }));
  };
  let id;

  const openUpdatePopup = (d) => {
    try {
      console.log(d);
      id = d;
      console.log(isPopupOpen.viewItem);
      setIsPopupOpen((prev) => ({
        ...prev,
        updateItem: true,
        viewItem: false,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const closePopup = () => {
    setIsPopupOpen((prev) => ({
      ...prev,
      updateItem: false,
      addItem: false,
      viewItem: true,
    }));
  };

  const validationSchema = Yup.object().shape({
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

  const formik = useFormik({
    initialValues: {
      itemName: "",
      price: "",
      typeId: "",
      unitId: "",
    },

    validationSchema,
    onSubmit: async (values,{ resetForm }) => {
      try {
        if (idvalue === 0) {
          await axios.post("/item/add", values);

        
        } else {
          await axios.put("/item/update/" + idvalue, values);
         
        }
        resetForm();
        setOpen(false);
        fetchData();
      } catch (error) {
        console.log(error);
      }
    },
  });
  const fetchall=async()=>{
    try{
      const res1=await axios.get("/unit");
      setOneUnit(res1.data);
      const res2 = await axios.get("/type");
      setOneType(res2.data);
    }catch(error){
      console.log(error);
    }
  };
  useEffect(()=>{
    fetchall();
  },[]);
    const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };
  const openAddModal1 = () => {
    setIsAddModalOpenU(true);
  };

  const closeAddModal1= () => {
    setIsAddModalOpenU(false);
  };
  const fetchData = async () => {
    try {
      if (isPopupOpen.updateItem) {
        const res = await axios.get("/item/read/" + id);
        console.log(res.data);
        setItems({
          ...items,
          itemName: res.data.itemName,
          price: res.data.price,
          typeId: res.data.typeId,
          unitId: res.data.unitId,
        });
      } else {
        const [res1, res2, res3] = await Promise.all([
          axios.get("/item"),
          axios.get("/type"),
          axios.get("/unit"),
        ]);
        setItems(res1.data);
        setTypes(res2.data);
        setUnits(res3.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  let itemstype;
  const type = () => {
    types.map((type) => {
      if (type.Id === formik.values.typeId) {
        itemstype = type.typeName;
      }
    });
  };
  type();

  let itemsunit;
  const unit = () => {
    units.map((unit) => {
      if (unit.Id === formik.values.unitId) {
        itemsunit = unit.unitName;
      }
    });
  };
  unit();

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/item/delete/${id}`);
      setItems(items.filter((item) => item.Id !== id)); 
    } catch (error) {
      console.log(error);
    }
  };
  const handleAdd = () => {
    setidvalue(0);
    formik.values.itemName = "";
    formik.values.price = "";
    formik.values.typeId = "";
    formik.values.unitId = "";
    setOpen(true);
    setIsAddItemModalOpen(true);
  };
  const handleUpdate = async (id) => {
    const res = await axios.get("/item/read/" + id);
    setidvalue(id);
    formik.values.itemName = res.data.itemName;
    formik.values.price = res.data.price;
    formik.values.typeId = res.data.typeId;
    formik.values.unitId = res.data.unitId;
    setOpen(true);
  };
  const handleClose = () => {
    setidvalue(0);
    setOpen(false);
    setIsAddItemModalOpen(false);
  };

  const handleOpen = () => {
    setOpen(false);
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
      fetchall();
      fetchData();
      formikAddType.resetForm();
    } catch (error) {
      console.log(error);
    }
  };
  const handleAddUnit=async(values)=>{
    try{
      if(!values.unitName){
        formikAddUnit.setErrors({unitName:"Unit Name is required"})
        return;
      }
      await axios.post("/unit/add",values)
      setIsAddModalOpenU(false); 
      fetchall();
      fetchData();
      formikAddUnit.resetForm(); 
  
    }catch(error){
      console.log(error);
    }
  };
  const formikAddType = useFormik({
    initialValues: {
      typeName: "",
    },
    validationSchema1,
    onSubmit: (values) => {
      handleAddType(values);
    },
  });
  const formikAddUnit = useFormik({
    initialValues: {
      unitName: "",
    },
    validationSchema2,
    onSubmit: (values) => {
      handleAddUnit(values);
    },
  });


  const columns = [
    { field: "Id", headerName: "ID", width: 100 },
    { field: "itemName", headerName: "Name", width: 200 },
    { field: "price", headerName: "Price", width: 150 },
    {
      field: "typeId",
      headerName: "Type",
      width: 150,
      valueGetter: (params) =>
        types.find((type) => type.Id === params)?.typeName || "",
    },
    {
      field: "unitId",
      headerName: "Unit",
      width: 150,
      valueGetter: (params) =>
        units.find((unit) => unit.Id === params)?.unitName || "",
    },
    {
      field: "action",
      headerName: "Action",
      width: 220,
      renderCell: (params) => (
        <>
          <Link>
            <Button
              onClick={() => handleUpdate(params.row.Id)}
              variant="outline-warning"
              className="m-1"
            >
              Update
            </Button>
          </Link>
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
    <div className="">
      <div className="p-3">
        <Header />
      </div>
      <div className="p-3">
        <div className="content-wrapper">
          <div className="container-xxl flex-grow-1 container-p-y">
            <div style={{ height: 400, width: "100%" }}>
              <div style={{ float: "right" }}>
                <Link onClick={handleAdd}>
                  <Icon
                    baseClassName="fas"
                    className="fa-plus-circle"
                    sx={{ fontSize: 40 }}
                  />
                </Link>
              </div>

              <br />
              <br />
              <br />

              <DataGrid
                rows={items}
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
            {idvalue !== 0 ? "Update Item" : "Add Item"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div>
              <div>
                <div>
                  <Form onSubmit={formik.handleSubmit} className="m-5">
                    <Form.Group
                      as={Row}
                      className="m-2"
                      controlId="formHorizontalitemsName"
                    >
                      <Form.Label column sm={4}>
                        itemName
                      </Form.Label>
                      <Col sm={8}>
                        <Form.Control
                          name="itemName"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          isInvalid={
                            formik.touched.itemName && formik.errors.itemName
                          }
                          style={{ maxWidth: "300px" }}
                          value={formik.values.itemName}
                        />
                        {formik.touched.itemName && formik.errors.itemName && (
                          <div className="text-danger mt-1">
                            {formik.errors.itemName}
                          </div>
                        )}
                      </Col>
                    </Form.Group>
                    <Form.Group
                      as={Row}
                      className="m-2"
                      controlId="formHorizontalPrice"
                    >
                      <Form.Label column sm={4}>
                        Price
                      </Form.Label>
                      <Col sm={8}>
                        <Form.Control
                          name="price"
                          type="number"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          isInvalid={
                            formik.touched.price && formik.errors.price
                          }
                          style={{ maxWidth: "300px" }}
                          value={formik.values.price}
                        />
                      </Col>
                    </Form.Group>
                    {idvalue !== 0 && (
                      <Form.Group as={Row} className="m-2">
                        <Form.Label column sm={4}>
                          TypeId
                        </Form.Label>
                        <Col sm={8}>
                          <Form.Control
                            disabled
                            readOnly
                            value={itemstype}
                          ></Form.Control>
                        </Col>
                      </Form.Group>
                    )}
                    <Form.Group as={Row} className="m-2">
                      <Form.Label column sm={4}>
                        {idvalue !== 0 ? "Change Type" : "Type"}
                      </Form.Label>
                      <Col sm={8}>
                      <div className="d-flex align-items-center">
                        <Form.Select
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          isInvalid={
                            formik.touched.typeId && formik.errors.typeId
                          }
                          style={{ maxWidth: "300px",marginRight: "10px" }}
                          name="typeId"
                        >

                          <option value="">Select Type</option>
                          {types.map((type) => (
                            <option value={type.Id}>{type.typeName}</option>
                          ))}
                        </Form.Select>
                        
                  

                        {formik.touched.typeId && formik.errors.typeId && (
                          <div className="text-danger mt-1">
                            {formik.errors.typeId}
                          </div>
                        )}
                       {isAddItemModalOpen && (
                       <Button variant="outline-primary" onClick={openAddModal}>+
                       </Button>)}

                      </div>
                      </Col>
                    </Form.Group>
                    {idvalue !== 0 && (
                      <Form.Group as={Row} className="m-2">
                        <Form.Label column sm={4}>
                          UnitId
                        </Form.Label>
                        <Col sm={8}>
                          <Form.Control
                            disabled
                            readOnly
                            value={itemsunit}
                          ></Form.Control>
                        </Col>
                      </Form.Group>
                    )}
                    <Form.Group as={Row} className="m-2">
                      <Form.Label column sm={4}>
                        {idvalue !== 0 ? "Change Unit" : "Unit"}
                      </Form.Label>
                      
                      <Col sm={8}>
                        <div className="d-flex align-items-center">
                        <Form.Select
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          isInvalid={
                            formik.touched.unitId && formik.errors.unitId
                          }
                          style={{ maxWidth: "300px",marginRight: "10px" }}
                          name="unitId"
                        >
                          <option value="">Select Unit</option>
                          {units.map((unit) => (
                            <option value={unit.Id}>{unit.unitName}</option>
                          ))}
                        </Form.Select>
                        {formik.touched.unitId && formik.errors.unitId && (
                          <div className="text-danger mt-1">
                            {formik.errors.unitId}
                          </div>
                        )}
                        {isAddItemModalOpen && (
                       <Button variant="outline-primary" onClick={openAddModal1}>+
                       </Button>)}
                      </div>
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
      <Modal show={isAddModalOpen} onHide={closeAddModal}>
     
          <Modal.Title>Add Type</Modal.Title>
       
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
                  Add
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
      
      <Modal show={isAddModalOpenU} onHide={closeAddModal1}>
<Modal.Body>
  <Form onSubmit={formikAddUnit.handleSubmit}>
    <Form.Group as={Row} className="m-2" controlId="formHorizontalUsername">
      <Form.Label column sm={2}>
        Unit Name
      </Form.Label>
      <Col sm={10}>
        <Form.Control
          type="text"
          placeholder="Unit Name"
          {...formikAddUnit.getFieldProps("unitName")}
          isInvalid={formikAddUnit.touched.unitName && formikAddUnit.errors.unitName}
          style={{ maxWidth: "300px" }}
        />
        <Form.Control.Feedback type="invalid">{formikAddUnit.errors.unitName}</Form.Control.Feedback>
      </Col>
    </Form.Group>
    <Row className="justify-content-md-center m-5">
      <Col md="auto">
        <Button variant="outline-success" type="submit">
          Add
        </Button>
      </Col>
    </Row>
  </Form>
</Modal.Body>
</Modal>
    </div>
  );
};

export default ItemView;