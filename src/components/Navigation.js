import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

const navigation = (props) => (
  <Navbar sticky="top">
    <Navbar.Brand href="https://tienpdinh.com/calculator">CalcFun</Navbar.Brand>
    <Navbar.Toggle />
    <Navbar.Collapse className="justify-content-end">
      <Nav className="mr-auto">
        <Nav.Link href="https://tienpdinh.com/calculator">Home</Nav.Link>
        <Nav.Link href="https://tienpdinh.com">Tien's Portfolio</Nav.Link>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);

export default navigation;
