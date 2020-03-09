import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import classes from "./css/Calculator.module.css";
import Firebase from "./FirebaseConfig";
import Calculation from "./Calculation";
import Container from "react-bootstrap/Container";

class Calculator extends Component {
  state = {
    x : '',
    y : '',
    op : '+',
    data: []
  }

  constructor (props) {
    super(props);
    this.itemsRef = Firebase.database().ref('Calculations');
  }

  componentDidMount () {
    this.listCalculations();
  }

  updateX = (evt) => {
    this.setState({
      x : evt.target.value
    });
  }

  updateY = (evt) => {
    this.setState({
      y : evt.target.value
    });
  }

  updateOp = (evt) => {
    this.setState({
      op : evt.target.value
    });
  }

  listCalculations = () => {
    let results = [];
    this.itemsRef.on('child_added', (dataSnapshot) => {
      results.unshift({
        x      : dataSnapshot.val().x,
        y      : dataSnapshot.val().y,
        result : dataSnapshot.val().result,
        op     : dataSnapshot.val().op,
        keyid  : dataSnapshot.key
      })
      this.setState({
        data : results
      })
    })
  }

  logCalculation = () => {
    let result = 0;
    const x = parseFloat(this.state.x);
    const y = parseFloat(this.state.y);
    if (this.state.op === '+')
      result = x + y;
    if (this.state.op === '-')
      result = x - y;
    if (this.state.op === '×')
      result = x * y;
    if (this.state.op === '÷')
      result = x / y;
    this.itemsRef.push({
      x : x,
      y : y,
      op : this.state.op,
      result : result
    });
  }

  render() {
    // Recalculate and render new data from server
    let data = this.state.data;
    const list = data.map((i, index) => {
      return <Calculation x={i.x} y={i.y} op={i.op} result={i.result} />
    });
    return (
      <Container className={classes.customForm}>
        <Form>
          <h2 className="text-center">Your calculation here</h2>
          <Form.Row>
            <Col>
              <Form.Control placeholder="x" value={this.state.x} 
                onChange={evt => this.updateX(evt)} />
            </Col>
            <Form.Group as={Col} controlId="formGridState">
              <Form.Control as="select" value={this.state.op}
                onChange={evt => this.updateOp(evt)}>
                <option>+</option>
                <option>-</option>
                <option>×</option>
                <option>÷</option>
              </Form.Control>
            </Form.Group>
            <Col>
              <Form.Control placeholder="y" value={this.state.y}
                onChange={evt => this.updateY(evt)} />
            </Col>
          </Form.Row>
          <Button className="btn-lg btn-dark btn-block" onClick={this.logCalculation}>
            Calculate and Log
          </Button>
        </Form>
        <Container className={classes.customLog}>
          {list}
        </Container>
      </Container>
    );
  }
}

export default Calculator;
