import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../Header";
import { Button } from "react-bootstrap";


const ViewUser = () => {
  const [requestRef, setRequestRef] = useState([]);
  const [customer, setCustomer] = useState([]);
  const [search, setSearch] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const requestRefResponse = await axios.get("/sales_ref");
        setRequestRef(requestRefResponse.data);
        const customResponse = await axios.get("/customer");
        setCustomer(customResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);
  return (
    <div className="">
      <div className="p-3">
        <Header />
      </div>{" "}
      <div className="p-3">
        {" "}
        <div className="content-wrapper">
          <div className="container-xxl flex-grow-1 container-p-y">
            <h4 class="fw-bold py-3 mb-4">
              <span class="text-muted fw-light">Reception/</span> View User
            </h4>
            
            <div className="card">
              <div className="navbar-nav align-items-center card-header m-2">
                <div className="nav-item d-flex align-items-center">
                  <i className="bx bx-search fs-4 lh-0" />
                  <input
                    type="text"
                    className="form-control border-0 shadow-none"
                    placeholder="Search... with Phone No"
                    aria-label="Search..."
                    onChange={(e) => setSearch(e.target.value)}
                    name="phone_no"
                  />
                </div>
              </div>
              <div className="table-responsive text-nowrap">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Id</th>
                      <th>Firstname</th>
                      <th>Lastname</th>
                      <th>Phone Number</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="table-border-bottom-0">
                    {requestRef.map((ref) => {
                      const cust = customer
                        .filter((customer1) => {
                          return search === ""
                            ? customer1
                            : customer1.phone_no.includes(search);
                        })
                        .find(
                          (c) => c.Id === ref.customerId && ref.statusId !== 1
                        );
                      if (!cust) return null;
                      const date = new Date(ref.date);
                      return (
                        <tr key={ref.id}>
                          <td>{cust.Id}</td>
                          <td>{cust.firstName}</td>
                          <td> {cust.lastName}</td>

                          <td>{cust.phone_no}</td>
                          <td>{`${date.getFullYear()}/${
                            date.getMonth() + 1
                          }/${date.getDate()}`}</td>
                          <td>{`${date.getHours()}:${String(
                            date.getMinutes()
                          ).padStart(2, "0")}`}</td>

                          {ref.statusId !== 1 && (
                            <>
                              <td>
                                <Link to={`/viewsale/${ref.Id}`}>
                                  <button className="btn btn-outline-secondary">
                                    View Sales
                                  </button>
                                </Link>
                                {ref.statusId !== 4 && (
                                  <Link to={`/updatesale/${ref.Id}`}>
                                    <button className="btn btn-outline-secondary">
                                      Update Sales
                                    </button>
                                  </Link>
                                )}
                              </td>
                            </>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="content-backdrop fade"></div>
        </div>
      </div>
    </div>
  );
};
export default ViewUser;
