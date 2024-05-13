import React, { useState, useEffect } from "react";
import { Form,Modal, Col, Row, Button } from "react-bootstrap";
import axios from "axios";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Icon from "@mui/material/Icon";
import Header from "../Header";
import { useFormik } from "formik";
import * as Yup from "yup";


const validationSchema = Yup.object().shape({
  unitName:Yup.string().required("Unit Name is required"),
});
const UnitView=()=>{
  const[units,setUnit]=useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [UnitData, setUnitData] = useState(null); 

  const fetchallunit=async()=>{
    try{
      const res=await axios.get("/unit");
      setUnit(res.data);
    }catch(error){
      console.log(error);
    }
  };
  useEffect(()=>{
    fetchallunit();
  },[]);
const handleDelete=async(id)=>{
  try{
    await axios.delete("unit/delete/"+id)
    setUnit(units.filter((unit)=>unit.Id!==id))
  }catch(error){
    console.log(error);
  }
};

const openAddModal=()=>{
  setIsAddModalOpen(true);
}
const closeAddModal=()=>{
  setIsAddModalOpen(false);
}

const openUpdateModal=async(id)=>{
  setSelectedUnitId(id);
  try{
    const unitResponse=await axios.get(`unit/read/${id}`)
    setUnitData(unitResponse.data);
    formikUpdateUnit.setValues({unitName:unitResponse.data.unitName});
    setIsUpdateModalOpen(true);
  }catch(error){
    console.log(error)
  }
};

const closeUpdateModal=()=>{
  setIsUpdateModalOpen(false);
  setSelectedUnitId(null);
  setUnitData(null);
};

const handleAddUnit=async(values)=>{
  try{
    if(!values.unitName){
      formikAddUnit.setErrors({unitName:"Unit Name is required"})
      return;
    }
    await axios.post("/unit/add",values)
    setIsAddModalOpen(false); 
    fetchallunit();
    formikAddUnit.resetForm(); 

  }catch(error){
    console.log(error);
  }
};

const handleUpdateUnit=async(updateUnitName)=>{
  try{
    if(!updateUnitName){
      formikUpdateUnit({unitName:"Unit Name is required"})
      return;
    }
    const unitExists = units.some((unit) => unit.unitName === updateUnitName && unit.Id !== selectedUnitId);
    if (unitExists) {
      formikUpdateUnit.setErrors({ unitName: "Unit name already exists." });
      return;
    }
    await axios.put(`/unit/update/${selectedUnitId}`, { unitName: updateUnitName });
    setIsUpdateModalOpen(false);
    fetchallunit();
    formikUpdateUnit.resetForm(); 
  }catch(error){
    console.log(error);
  }
};
const formikAddUnit = useFormik({
  initialValues: {
    unitName: "",
  },
  validationSchema,
  onSubmit: (values) => {
    handleAddUnit(values);
  },
});

const formikUpdateUnit = useFormik({
  initialValues: {
    unitName: UnitData?.unitName || "",
  },
  validationSchema,
  onSubmit: (values) => {
    handleUpdateUnit(values.unitName);
  },
});

const columns = [
  { field: "Id", headerName: "ID", width: 100 },
  { field: "unitName", headerName: "Unit", width: 200 },
  {
    field: "actions",
    headerName: "Actions",
    width: 200,
    sortable: false,
    filterable: false,
    renderCell: (params) => (
              <div>
              <Button onClick={() => openUpdateModal(params.row.Id, params.row)} variant="outline-warning" className="m-1">
                Update
              </Button>
              <Button onClick={() => handleDelete(params.row.Id)} variant="outline-danger" className="m-1">
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
            <Icon baseClassName="fas" className="fa-plus-circle" sx={{ fontSize: 40, cursor: "pointer" }} onClick={openAddModal} />
          </div>
          <br />
          <br />
          <DataGrid  rows={units}
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
              getRowId={(row) => row.Id} />
        </div>
      </div>
      <div className="content-backdrop fade"></div>
    </div>
  </div>


  <Modal show={isAddModalOpen} onHide={closeAddModal}>

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


  <Modal show={isUpdateModalOpen} onHide={closeUpdateModal}>

    <Modal.Body>
      <Form onSubmit={formikUpdateUnit.handleSubmit}>
        <Form.Group as={Row} className="m-2" controlId="formHorizontalUsername">
          <Form.Label column sm={2}>
            Unit Name
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              placeholder="Unit Name"
              {...formikUpdateUnit.getFieldProps("unitName")}
              isInvalid={formikUpdateUnit.touched.unitName && formikUpdateUnit.errors.unitName}
              style={{ maxWidth: "300px" }}
            />
            <Form.Control.Feedback type="invalid">{formikUpdateUnit.errors.unitName}</Form.Control.Feedback>
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
}
export default UnitView;