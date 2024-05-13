import axios from "axios";
import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
function Header() {
  const [datas, setData] = useState({
    admin: false,
    reception: false,
    worker: false,
    item: false,
    user: false,
    customer: false,
  });

  const listner = (e) => {
    e.preventDefault();
    console.log(e);
    console.log("hh");
    console.log(datas.item);
  };
  const navigate = useNavigate();
  useEffect(() => {
    const validity = async () => {
      await axios.get("/validity").then((res) => {
        console.log(res.data);
        if (res.data.roleId === 1) {
          setData((prev) => ({ ...prev, admin: true }));

          if (
            window.location.pathname === "/itemview" ||
            window.location.pathname === "/unitview" ||
            window.location.pathname === "/typeview" ||
            window.location.pathname === "/addtype" ||
            window.location.pathname === "/addunit" ||
            window.location.pathname === "/itemadd"
          ) {
            setData((prev) => ({ ...prev, item: true }));
            console.log(window.location.pathname, "ioioioi");
            console.log(datas.item);
          } else if (
            window.location.pathname === "/userview" ||
            window.location.pathname === "/useradd" ||
            window.location.pathname === "/roleview" ||
            window.location.pathname === "/addrole"
          ) {
            setData((prev) => ({ ...prev, user: true }));
          } else if (
            window.location.pathname === "/addcustomer" ||
            window.location.pathname === "/viewuser"
          ) {
            setData((prev) => ({ ...prev, customer: true }));
          } else {
            console.log(window.location.pathname);
            setData((prev) => ({ ...prev, item: false }));
            console.log(datas.item, "opopop");
          }
        } else if (res.data.roleId === 1) {
          setData((prev) => ({ ...prev, admin: true }));
          setData((prev) => ({ ...prev, customer: false }));
        } else if (res.data.roleId === 2) {
          setData((prev) => ({ ...prev, reception: true }));
        } else if (res.data.roleId === 3) {
          setData((prev) => ({ ...prev, worker: true }));
        } else {
          navigate(`/`);
        }
      });
    };
      // validity();
  }, []);
  const handleClick = async () => {
    await axios.get("/logout");
    navigate(`/`);
  };
  return (
    <Navbar expand="lg" className="bg-body-tertiary" bg="dark">
      <Container fluid>
        {datas.admin && <Navbar.Brand href={`/admin`}>Admin</Navbar.Brand>}
        {datas.reception && (
          <Navbar.Brand href={`/admin`}>Reception</Navbar.Brand>
        )}
        {datas.worker && <Navbar.Brand href={`/worker`}>Worker</Navbar.Brand>}
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "50ph" }}
            navbarScroll
          >
            {(datas.admin || datas.reception)  && !datas.item && !datas.user && (
              <Nav.Link href={`/reception`}>New Request</Nav.Link>
            )}
            {(datas.admin || datas.reception) && !datas.item && !datas.user && (
              <Nav.Link href={`/viewrequest`}>View Request</Nav.Link>
            )}
            {(datas.admin || datas.reception) && !datas.item && !datas.user && (
              <Nav.Link href={`/customerreport`}>Customer Report</Nav.Link>
            )}
            {(datas.admin || datas.reception) && !datas.item && !datas.user && (
              <Nav.Link href={`/viewallsale`}>View All Sales</Nav.Link>
            )}

            {(datas.admin || datas.reception) && !datas.item && !datas.user && (
              <Nav.Link href={`/viewuser`}>Customer</Nav.Link>
            )}

            {datas.admin && !datas.item && (
              <Nav.Link href={`/userview`}>User</Nav.Link>
            )}
            {datas.admin && datas.user && !datas.item && (
              <Nav.Link href={`/roleview`}>Role</Nav.Link>
            )}

            {datas.admin && !datas.user && (
              <Nav.Link href={`/itemview`}>Item</Nav.Link>
            )}

            {datas.admin && datas.item && (
              <Nav.Link href={`/unitview`}>Unit</Nav.Link>
            )}

            {datas.admin && datas.item && (
              <Nav.Link href={`/typeview`}>Type</Nav.Link>
            )}

            {!(datas.admin || datas.reception || datas.worker) && (
              <Nav.Link href={`/`}>Login</Nav.Link>
            )}
            {(datas.admin || datas.reception || datas.worker) && (
              <Nav.Link onClick={handleClick}>Logout</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
