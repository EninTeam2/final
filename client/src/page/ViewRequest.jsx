import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
import Header from "../Header";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";


const ViewRequest = () => {
  const [customers, setCustomers] = useState([]);
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [requestsData, setRequestsData] = useState([]);
  const [requestRefsData, setRequestRefsData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const requestResponse = await axios.get("/request");
        setRequestsData(requestResponse.data);

        const requestRefResponse = await axios.get("/request_ref");
        setRequestRefsData(requestRefResponse.data);

        const customerResponse = await axios.get("/customer");
        setCustomers(customerResponse.data);

        const itemResponse = await axios.get("/item");
        setItems(itemResponse.data);

        const userResponse = await axios.get("/user");
        setUsers(userResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  const combineAndFilterData = () => {
    const combinedAndFilteredData = [];

    requestsData.forEach((request) => {
      const requestRef = requestRefsData.find(
        (ref) => ref.Id === request.requestRefId
      );

      if (requestRef && (request.statusId === 5 || request.statusId === 6)) {
        const customer = customers.find(
          (customer) => customer.Id === requestRef.customerId
        );
        const user = users.find((user) => user.Id === request.userId);
        const item = items.find((item) => item.Id === request.itemId);

        if (customer && user && item) {
          const status = request.statusId === 5 ? "Approved" : "Rejected";

          const combinedData = {
            Id: request.Id,
            price: request.price,
            user: user.user_name,
            item: item.itemName,
            status: status,
            firstName: customer.firstName,
            lastName: customer.lastName,
            date: formatDateTime(requestRef.date), // Format date here
            comment: requestRef.comment,
          };

          combinedAndFilteredData.push(combinedData);
        }
      }
    });

    return combinedAndFilteredData;
  };

  const formatDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    return dateTime.toLocaleString();
  };

  const combinedAndFilteredData = combineAndFilterData();

  const columns = [
    { field: "Id", headerName: "Id", width: 100 },
    { field: "firstName", headerName: "First Name", width: 150 },
    { field: "lastName", headerName: "Last Name", width: 150 },
    { field: "item", headerName: "Item", width: 150 },
    { field: "price", headerName: "Price", width: 120 },
    { field: "user", headerName: "User", width: 150 },
    { field: "date", headerName: "Date and Time", width: 180 },
    { field: "comment", headerName: "Comment", width: 180 },
    { field: "status", headerName: "Status", width: 150 },
  ];

  return (
    <Container fluid>
      <Row>
        <Col md={12} className="p-3">
          <Header />
          <Container>
            <Row>
              <Col>
                <h1>All Request Data</h1>
                <div style={{ height: "calc(100vh - 150px)", width: "100%" }}>
                  <DataGrid
                    rows={combinedAndFilteredData}
                    columns={columns}
                    getRowId={(row) => row.Id}
                    disableColumnFilter
                    disableColumnSelector
                    disableDensitySelector
                    slots={{ toolbar: GridToolbar }}
                    slotProps={{
                      toolbar: {
                        showQuickFilter: true,
                      },
                    }}
                    pageSize={5}
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
    </Container>
  );
};

export default ViewRequest;
