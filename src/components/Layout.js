import React, { Component } from 'react';
import Calculator from './Calculator';
import Container from 'react-bootstrap/Container';
import Navigation from './Navigation';
import classes from './css/Calculator.module.css';

class Layout extends Component {
    render () {
        return (
            <Container className={classes.elementBtn}>
                <Navigation />
                <Calculator />
            </Container>
        );
    }
}

export default Layout;