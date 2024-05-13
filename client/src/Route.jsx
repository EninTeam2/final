import React, { useState } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Viewallreport from "./page/Viewallreport";

import UserView from "./page/UserView";
import AllSalesRef from "./page/AllSalesRef";
import ItemView from "./page/ItemView";

import Login from "./Login";
import UpdateSale from "./page/UpdateSale";
import Homepagereception from "./page/Homepagereception";
import Homepagework from "./page/Homepagework";

import AddRequest from "./page/AddRequest";
import ViewSales from "./page/ViewSales";
import ViewUser from "./page/ViewUser";
import ViewRequest from "./page/ViewRequest";
import EditRequest from "./page/EditRequest";


import TypeView from "./page/TypeView";
import UnitView from "./page/UnitView";
import RoleView from "./page/RoleView";


import RemainPrice from "./page/RemainPrice";
import CustomerReport from "./page/CustomerReport";


const Home = () => {
  return (
    <BrowserRouter>
      <Routes>
       
        <Route path="/admin" element={<Viewallreport />} />
        <Route path="/worker" element={<Homepagework />} />
        <Route path="/reception" element={<Homepagereception />} />
        <Route path="/" element={<Login />} />
       
        <Route path="/userview" element={<UserView />} />
        <Route path="/customerreport" element={<CustomerReport />} />
        <Route path="/viewallsale" element={<AllSalesRef />} />
        <Route path="/itemview" element={<ItemView />} />
        <Route path="/roleview" element={<RoleView />} />
        <Route path="/unitview" element={<UnitView />} />
        <Route path="/typeview" element={<TypeView />} />
        <Route path="/remainprice/:id" element={<RemainPrice />} />
        <Route path="/updatesale/:id" element={<UpdateSale />} />

        <Route path="/request/:id" element={<AddRequest />} />
        <Route path="/viewsale/:id" element={<ViewSales />} />
        <Route path="/viewuser" element={<ViewUser />} />
        <Route path="/viewrequest" element={<ViewRequest />} />
        <Route path="/editrequest/:id" element={<EditRequest />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Home;
