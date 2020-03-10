import React from "react";
import Toast from "react-bootstrap/Toast";

const Calculation = props => {
  return (
    <Toast>
      <Toast.Header closeButton={false}>
        <img className="rounded mr-2" alt="" />
        <strong className="mr-auto">Anonymous</strong>
        <small>{props.stat}</small>
      </Toast.Header>
      <Toast.Body>
        {props.x + " " + props.op + " " + props.y + " = " + props.result}
      </Toast.Body>
    </Toast>
  );
};

export default Calculation;
