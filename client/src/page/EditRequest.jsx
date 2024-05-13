import React, { useEffect, useState } from "react";
import Header from "../Header";

import axios from "axios";
import { useParams } from "react-router-dom";
import { Button, Form, Col, Row } from "react-bootstrap";

const EditRequest = () => {
  const [requests, setRequest] = useState([]);
  const [items, setItem] = useState([]);
  const [users, setUser] = useState([]);
  const [status, setStatus] = useState(true);
  const { id } = useParams();
  const [newrequests, setNewrequest] = useState({
    Id: "",
    itemId: "",
    userId: "",
    price: "",
    requestRefId: parseInt(id),
  });

  useEffect(() => {
    const fetchall = async () => {
      try {
        const res1 = await axios.get("/request");
        setRequest(res1.data);
        const res2 = await axios.get("/item");
        setItem(res2.data);
        const res3 = await axios.get("/user");
        setUser(res3.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchall();
  }, []);
  const handelupdate = (id) => {
    const request = requests.find((req) => req.Id === id);
    setStatus(false);
    setNewrequest({
      ...newrequests,
      Id: request.Id,
      itemId: request.itemId,
      userId: request.userId,
      price: request.price,
    });
  };

  const handeldelete = async (id) => {
    try {
      await axios.delete("/request/delete/" + id);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };
  const handleChange = (e) => {
    setNewrequest({ ...newrequests, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (id) => {
    try {
      await axios.put("/request/update/" + id, newrequests);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };
  const handleInsert = async () => {
    try {
      await axios.post("/request/add", newrequests);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="">
      <div className="p-3">
        <Header />
      </div>{" "}
      <div className="p-3">
        <div className="content-wrapper">
          <div className="container-xxl flex-grow-1 container-p-y">
            <div className="container-xxl flex-grow-1 container-p-y">
              <div className="row">
                <div className="col-md-7 col-lg-6  order-0 mb-4">
                  <div className="card">
                    <h5 className="card-header gy-3">
                      Request Data
                      {!status && (
                       
                        <button
                          className="btn btn-outline-primary"
                          style={{ float: "right" }}
                          title="Add New Request"
                          onClick={() => {
                            setStatus(true);
                            setNewrequest({
                              ...newrequests,
                              Id: "",
                              itemId: "",
                              userId: "",
                              price: "",
                            });
                          }}
                        >
                          <i
                            className=" bx bxs-plus-square fa-3x"
                            style={{ margin: "-10px" }}
                          ></i>
                        </button>
                      )}
                    </h5>
                    <div className="table-responsive text-nowrap">
                      <table className="table table-hover">
                        <thead className="text-center">
                          <tr>
                            <th>Id</th>
                            <th>Item</th>
                            <th>User</th>
                            <th>Price</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody className="table-border-bottom-5 text-center">
                          {requests.map((req) => {
                            const item =
                              items.find((i) => i.Id === req.itemId) || null;
                            const user =
                              users.find((u) => u.Id === req.userId) || null;

                            if (
                              item !== null &&
                              user !== null &&
                              parseInt(id) === req.requestRefId &&
                              req.statusId === 4
                            ) {
                              return (
                                <tr>
                                  <td>{req.Id}</td>
                                  <td>{item.itemName}</td>
                                  <td>{user.user_name}</td>
                                  <td>{req.price}</td>
                                  <td>
                                    <Button
                                      onClick={(e) => handelupdate(req.Id)}
                                      variant="outline-warning"
                                      className="m-1"
                                    >
                                      Update
                                    </Button>
                                    <Button
                                      onClick={(e) => handeldelete(req.Id)}
                                      variant="outline-danger"
                                      className="m-1"
                                    >
                                      Delete
                                    </Button>
                                  </td>
                                </tr>
                              );
                            } else {
                              return <></>;
                            }
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="col-md-5 col-lg-6 order-1 mb-4">
                  <div className="card">
                    <h5
                      className="card-header"
                      style={{
                        backgroundColor: "darkblue",
                        color: "whitesmoke",
                        float: "left",
                      }}
                    >
                      {status && (
                        <div style={{ float: "left" }}>
                          Insert New Request Data
                        </div>
                      )}
                      {!status && (
                        <div>
                          Update Request Data{" "}
                          <span style={{ float: "right", color: "goldenrod" }}>
                            {" "}
                            ID {newrequests.Id}
                          </span>
                        </div>
                      )}
                    </h5>
                    <div className="table-responsive text-nowrap">
                      <Form className="m-1">
                        <Form.Group
                          as={Row}
                          className="m-1"
                          controlId="formHorizontalEmail"
                        >
                          <Form.Label column sm={3}>
                            User
                          </Form.Label>
                          <Col sm={9}>
                            <Form.Select
                              name="userId"
                              value={newrequests.userId}
                              onChange={handleChange}
                              required
                            >
                              <option value="">Select a User</option>
                              {users
                                .filter((user) => user.roleId === 3)
                                .map((user) => (
                                  <option key={user.Id} value={user.Id}>
                                    {user.user_name}
                                  </option>
                                ))}
                            </Form.Select>
                          </Col>
                        </Form.Group>{" "}
                        <Form.Group
                          as={Row}
                          className="m-1"
                          controlId="formHorizontalEmail"
                        >
                          <Form.Label column sm={3}>
                            Item
                          </Form.Label>{" "}
                          <Col sm={9}>
                            <Form.Select
                              name="itemId"
                              value={newrequests.itemId}
                              onChange={handleChange}
                              required
                            >
                              <option value="">Select an Item</option>
                              {items.map((item) => (
                                <option key={item.Id} value={item.Id}>
                                  {item.itemName}
                                </option>
                              ))}
                            </Form.Select>
                          </Col>
                        </Form.Group>
                        <Form.Group
                          as={Row}
                          className="m-1"
                          controlId="formHorizontalUsername"
                        >
                          <Form.Label column sm={3}>
                            Price
                          </Form.Label>
                          <Col sm={9}>
                            <Form.Control
                              type="number"
                              name="price"
                              value={newrequests.price}
                              onChange={handleChange}
                              required
                            />
                          </Col>
                        </Form.Group>
                        <Row className="justify-content-md-center m-5">
                          {status && (
                            <Col md="auto">
                              <Button
                                variant="outline-success"
                                onClick={(e) => handleInsert()}
                              >
                                Insert
                              </Button>
                            </Col>
                          )}
                          {!status && (
                            <Col md="auto">
                              <Button
                                variant="outline-info"
                                onClick={(e) => handleSubmit(newrequests.Id)}
                              >
                                Update
                              </Button>
                            </Col>
                          )}
                        </Row>
                      </Form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="content-backdrop fade"></div>
        </div>
      </div>
    </div>
  );
};

export default EditRequest;
