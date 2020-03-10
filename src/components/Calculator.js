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
    this.offsetRef = Firebase.database().ref('.info/serverTimeOffset');
  }

  componentDidMount () {
    this.listCalculations();
    this.getServerTime();
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

  getServerTime = () => {
    let estimatedServerTimeMs = 0;
    this.offsetRef.on('value', (snap) => {
      const offset = snap.val();
      estimatedServerTimeMs = new Date().getTime() + offset;
    });
    return estimatedServerTimeMs;
  }

  listCalculations = () => {
    let results = [];
    this.itemsRef.on('child_added', (dataSnapshot) => {
      const crtTime = this.getServerTime();
      const offset  = crtTime - dataSnapshot.val().crtTime;
      console.log(offset);
      let status = '';
      if (offset < 30000)
        status = 'just now';
      else if (offset < 60000)
        status = '30s ago';
      else
        status = 'a while ago';
      results.unshift({
        x      : dataSnapshot.val().x,
        y      : dataSnapshot.val().y,
        result : dataSnapshot.val().result,
        op     : dataSnapshot.val().op,
        keyid  : dataSnapshot.key,
        stat   : status
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
      x      : x,
      y      : y,
      op     : this.state.op,
      result : result,
      crtTime: this.getServerTime()
    });
  }

  render() {
    // Recalculate and render new data from server
    let data = this.state.data.slice(0,10);
    const list = data.map((i, _) => {
      return <Calculation x={i.x} y={i.y} op={i.op} result={i.result} key={i.keyid} stat={i.stat}/>
    });
    return (
      <Container className={classes.customForm}>
        <Form onSubmit={this.logCalculation}>
          <h2 className="text-center">Your calculation here</h2>
          <Form.Row>
            <Col>
              <Form.Group>
                <Form.Control required placeholder="x" value={this.state.x} 
                  onChange={evt => this.updateX(evt)} />
                <Form.Control.Feedback type="invalid">
                  Enter x!
                </Form.Control.Feedback>
              </Form.Group>
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
              <Form.Group>
                <Form.Control required placeholder="y" value={this.state.y}
                  onChange={evt => this.updateY(evt)} />
                <Form.Control.Feedback type="invalid">
                  Enter y!
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Form.Row>
          <Button type="submit" className="btn-lg btn-dark btn-block">
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
