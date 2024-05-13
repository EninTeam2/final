import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../Header";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Form, Col, Row, Button } from "react-bootstrap";

const AddRequest = () => {
  
  const validationSchema = Yup.object().shape({
    user: Yup.string().required("User is required"),
    item: Yup.string().required("Item is required"),
    price: Yup.number().required("Price is required").positive("Price must be positive").nullable(),
  });
  const [formData, setFormData] = useState({
    user: "",
    item: "",
    price: "",
    
    status: "4",
  });
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [requestData, setRequestData] = useState([]);
 
  const [statuses, setStatuses] = useState([]);

  const { id } = useParams();
  const Id = id;
  useEffect(() => {
    async function fetchData() {
      try {
        const usersResponse = await axios.get("/user");
        setUsers(usersResponse.data);
        const itemsResponse = await axios.get("/item");
        setItems(itemsResponse.data);
       
        const statusesResponse = await axios.get("/status");
        setStatuses(statusesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [Id]);
  console.log(Id);

  const formik = useFormik({
    initialValues: {
      user: "",
      item: "",
      price: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setRequestData((prevData) => [...prevData, values]);
      } catch (error) {
        console.error("Error submitting request:", error);
      }
    },
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setRequestData((prevData) => [...prevData, formData]);
    } catch (error) {
      console.error("Error submitting request:", error);
    }
  };
  const deleteRequest = (id) => {
    console.log(id);
    const newItems = requestData.filter((item, index) => index !== id);
    setRequestData(newItems);
  };
  const navigate = useNavigate();
  const submitData = async (e) => {
    e.preventDefault();
    try {
      
      const res = await axios.post("/request_ref/add", {
        totalprice: totalPrice,
        customerId: parseInt(Id),
        statusId: formData.status,
      });
      console.log(res);
      if (res) {
        for (let i = 0; i <= requestData.length - 1; i++) {
          const requestuserId = requestData[i].user;
          const requestitemId = requestData[i].item;
          const requestPrice = requestData[i].price;
          console.log(requestData, requestuserId, requestPrice);
          axios.post("/request/add", {
            userId: requestuserId,
            itemId: requestitemId,
            requestRefId: res.data.Id,
            price: requestPrice,
            statusId: 4,
          });
          console.log("Request submitted successfully:");
        }
        navigate("/reception");
      }
    } catch (error) {
      console.error("Error saving data");
    }
  };
  const totalPrice = requestData.reduce(
    (tot, req) => tot + parseFloat(req.price),
    0
  );
  return (
    
    <div className="">
    <div className="p-3">
      <Header />
    </div>
    <div className="p-3">
      <div className="content-wrapper">
        <div className="container-xxl flex-grow-1 container-p-y">
          <Form className="m-5" onSubmit={formik.handleSubmit}>
            <Form.Group as={Row} className="m-2" controlId="formHorizontalEmail">
              <Form.Label column sm={2}>User</Form.Label>
              <Col sm={10}>
                <Form.Control
                  as="select"
                  name="user"
                  {...formik.getFieldProps("user")}
                  className={formik.errors.user && formik.touched.user && "is-invalid"}
                  style={{ maxWidth: "300px" }}
                >
                  <option value="">Select a User</option>
                  {users
                    .filter((user) => user.roleId === 3)
                    .map((user) => (
                      <option key={user.Id} value={user.Id}>
                        {user.user_name}
                      </option>
                    ))}
                </Form.Control>
                {formik.touched.user && formik.errors.user&& (
      <div className="text-danger mt-1">{formik.errors.user}</div>
      )}
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="m-2" controlId="formHorizontalEmail">
              <Form.Label column sm={2}>Item</Form.Label>
              <Col sm={10}>
                <Form.Control
                  as="select"
                  name="item"
                  {...formik.getFieldProps("item")}
                  className={formik.errors.item && formik.touched.item && "is-invalid"}
                  style={{ maxWidth: "300px" }}
                >
                  <option value="">Select an Item</option>
                  {items.map((item) => (
                    <option key={item.Id} value={item.Id}>
                      {item.itemName}
                      
                    </option>
                  ))}
                </Form.Control>
                {formik.touched.item && formik.errors.item && (
      <div className="text-danger mt-1">{formik.errors.item}</div>
      )}
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="m-2" controlId="formHorizontalUsername">
              <Form.Label column sm={2}>Price</Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="number"
                  name="price"
                  {...formik.getFieldProps("price")}
                  className={formik.errors.price && formik.touched.price && "is-invalid"}
                  style={{ maxWidth: "300px" }}
                />
                      {formik.touched.price && formik.errors.price && (
      <div className="text-danger mt-1">{formik.errors.price}</div>
      )}
                
              </Col>
            </Form.Group>

            <Row className="justify-content-md-center m-5">
              <Col md="auto">
                <Button variant="outline-success" type="submit" disabled={formik.isSubmitting}>Submit</Button>
              </Col>
            </Row>
          </Form>


              <div className="card">
                <div className="navbar-nav align-items-center card-header m-2">
                  <div className="nav-item d-flex align-items-center">
                    <h4>Requests</h4>
                  </div>
                </div>
                <div className="table-responsive text-nowrap">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Item</th>
                        <th>Price</th>

                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody className="table-border-bottom-0">
                      {requestData.map((request, index) => (
                        <tr key={index}>
                          <td>
                            {users.map((user) =>
                              user.Id == request.user ? user.user_name : ""
                            )}
                          </td>
                          <td>
                            {items.map((item) =>
                              item.Id == request.item ? item.itemName : ""
                            )}
                          </td>
                          <td>{request.price}</td>

                          <td>
                            <Link>
                              <button
                                onClick={(e) => deleteRequest(index)}
                                className="btn btn-outline-secondary"
                              >
                                Delete
                              </button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div>
                    <Form.Group
                      as={Row}
                      className="m-2"
                      controlId="formHorizontalUsername"
                    >
                      <Form.Label column sm={4}>
                        Total Price
                      </Form.Label>
                      <Col sm={4}>
                        <Form.Control
                          type="number"
                          value={totalPrice}
                          readOnly
                        />
                      </Col>
                      <Col>
                        <Button variant="outline-success" onClick={submitData}>
                          Save
                        </Button>
                      </Col>
                    </Form.Group>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="content-backdrop fade"></div>
        </div>
      </div>
 
 
  );
};

export default AddRequest;
