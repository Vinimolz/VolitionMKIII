import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom'
import { Button, Row, Col, ListGroup, Image, Card, ListGroupItem } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import CheckoutSteps from '../components/CheckoutSteps'
import FormContainer  from '../components/FormContainer'
import Message  from '../components/Message'
import { createOrder } from '../actions/orderActions'
import { ORDER_CREATE_RESET } from '../constants/OrderConstants'


function PlaceOrderScreen() {

    const orderCreate = useSelector(state => state.orderCreate)
    const { order, error, success } = orderCreate 

    const userLogin = useSelector(state => state.userLogin)
    const {userInfo} = userLogin

    const dispatch = useDispatch()

    const history = useNavigate();

    const cart = useSelector(state => state.cart)

    cart.itemsPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)
    cart.shippingPrice = (cart.itemsPrice > 100 ? 0 : 10).toFixed(2)
    cart.taxPrice = Number((0.082) * cart.itemsPrice).toFixed(2)
    cart.totalPrice = (Number(cart.itemsPrice) + Number(cart.shippingPrice) + Number(cart.taxPrice)).toFixed(2)
    
    if(!cart.paymentMethod){
        history('/payment')
    }

    useEffect(() => {
        if(success){
            history(`/order/${order._id}`)
            dispatch({type: ORDER_CREATE_RESET})
        }
    }, [success, history])

    const placeOrder = () => {
        if(!userInfo){
            history('/login')
        } else {
            dispatch(createOrder({
                orderItems : cart.cartItems,
                shippingAddress : cart.shippingAddress,
                paymentMethod : cart.paymentMethod,
                itemsPrice : cart.itemsPrice, 
                shippingPrice : cart.shippingPrice,
                taxPrice : cart.taxPrice,
                totalPrice : cart.totalPrice

            }))
        }
    }

  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4 />

      <Row>

        <Col md={8}>
            <ListGroup variant='Flush'>
                <ListGroupItem>
                    <h2>Shipping</h2>

                    <p>                        
                        {cart.shippingAddress.address}, {cart.shippingAddress.city}
                        {'  '}
                        {cart.shippingAddress.postalCode},
                        {'  '}
                        {cart.shippingAddress.country}
                    </p>

                </ListGroupItem>

                <ListGroupItem>
                    <h2>Payment Method</h2>

                    <p>                        
                        {cart.paymentMethod}
                    </p>

                </ListGroupItem>

                <ListGroupItem>
                    <h2>Order Items</h2>
                    {cart.cartItems.length === 0    
                        ? <Message variant='info'>Your Cart is Empty</Message>
                        : (
                            <ListGroup variant='flush'>
                                {cart.cartItems.map((item, index) =>(
                                    <ListGroupItem key={index}>
                                        <Row>
                                            <Col md={1}>
                                                <Image src={item.image} alt={item.name} fluid rounded />
                                            </Col>

                                            <Col>
                                                <Link to={`/product/${item.product}`}>{item.name}</Link>
                                            </Col>

                                            <Col md={4}>
                                                {item.qty} X {item.price} = ${(item.qty * item.price).toFixed(2)}
                                            </Col>

                                        </Row>
                                    </ListGroupItem>
                                ))}
                            </ListGroup>
                        )}
                </ListGroupItem>

            </ListGroup>
        </Col>

        <Col md={4}>
            <Card>
                <ListGroup variant='flush'>

                    <ListGroup.Item>
                        <h2>Order Summary</h2>
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <Row>
                            <Col>Item: </Col>
                            <Col>${ cart.itemsPrice }</Col>
                        </Row>
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <Row>
                            <Col>Shipping: </Col>
                            <Col>${ cart.shippingPrice }</Col>
                        </Row>
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <Row>
                            <Col>taxes and fees: </Col>
                            <Col>${ cart.taxPrice }</Col>
                        </Row>
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <Row>
                            <Col>Total: </Col>
                            <Col>${ cart.totalPrice }</Col>
                        </Row>
                    </ListGroup.Item>

                    <ListGroup.Item>
                        {error && <Message variant='danger'>{error}</Message>}
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <Button
                            type='button'
                            variant='outline-info'
                            className='btn-block'
                            disabled = {cart.cartItems === 0}
                            onClick={placeOrder}
                        >
                            Place order
                        </Button>
                    </ListGroup.Item>

                </ListGroup>
            </Card>
        </Col>
      </Row>
    </div>
  )
}

export default PlaceOrderScreen
