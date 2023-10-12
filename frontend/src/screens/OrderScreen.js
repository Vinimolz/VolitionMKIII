import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom'
import { Button, Row, Col, ListGroup, Image, Card, ListGroupItem } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

import FormContainer  from '../components/FormContainer'
import Message  from '../components/Message'
import Loader from '../components/Loader'
import { getOrderDetails, deliverOrder } from '../actions/orderActions'
import { ORDER_DELIVER_RESET } from '../constants/OrderConstants'

function OrderScreen(match) {

    const history = useNavigate();

    const { id: orderId } = useParams();
    const dispatch = useDispatch()

    const orderDetails = useSelector(state => state.orderDetails)
    const { order, error, loading } = orderDetails    

    const orderDeliver = useSelector(state => state.orderDeliver)
    const { loading:loadingDeliver, success:successDeliver } = orderDeliver 
    
    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin   

    if(!loading && !error){
        order.itemsPrice = order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)
    }
    
    useEffect(() => {

        if(!userInfo){
            history('/login')
        }

        if(!order || order._id !== Number(orderId) || successDeliver){
            dispatch(getOrderDetails(orderId))
            dispatch({type: ORDER_DELIVER_RESET})
        }
    }, [dispatch, order, orderId, successDeliver])

    const deliverhandler = () => {
        dispatch(deliverOrder(order))
    }

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger' >{error}</Message>
  ) : (
        <div>
        <Row>
            <h6>Order id: {order._id}</h6>
            <Col md={8}>
                <ListGroup variant='Flush'>
                    <ListGroupItem>
                        <h2>Shipping</h2>
                        <p><strong>Name: </strong>{order.user.name}</p>
                        <p><strong>Email: </strong><a href={`mailto:${order.user.email}`}>{order.user.email}</a></p>
                        <p><strong>Shipping to:</strong>                        
                            {order.shippingAddress.address}, {order.shippingAddress.city}
                            {'  '}
                            {order.shippingAddress.postalCode},
                            {'  '}
                            {order.shippingAddress.country}
                        </p>

                        {order.isDelivered ? (
                            <Message variant='success'>Delivered on {order.deliveredAt}</Message>
                        ): (
                            <Message variant='warning'>Not delivered</Message>
                        )}

                    </ListGroupItem>

                    <ListGroupItem>
                        <h2>Payment Method</h2>

                        <p>                        
                            {order.paymentMethod}
                        </p>

                        {order.isPaid ? (
                            <Message variant='success'>Paid on {order.paidAt}</Message>
                        ): (
                            <Message variant='warning'>Not paid</Message>
                        )}

                    </ListGroupItem>

                    <ListGroupItem>
                        <h2>Order Items</h2>
                        {order.orderItems.length === 0    
                            ? <Message variant='info'>Order is Empty</Message>
                            : (
                                <ListGroup variant='flush'>
                                    {order.orderItems.map((item, index) =>(
                                        <ListGroupItem key={index}>
                                            <Row>
                                                <Col md={1}>
                                                    <Image src={item.image} alt={item.name} fluid rounded />
                                                </Col>

                                                <Col>
                                                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                                                </Col>

                                                <Col md={4}>
                                                    {item.quantity} X {item.price} = ${(item.quantity * item.price).toFixed(2)}
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
                                <Col>${ order.totalPrice }</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>Shipping: </Col>
                                <Col>${ order.shippingPrice }</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>taxes and fees: </Col>
                                <Col>${ order.taxPrice }</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>Total: </Col>
                                <Col>${ order.totalPrice }</Col>
                            </Row>
                        </ListGroup.Item>
                    </ListGroup>
                    {loadingDeliver && <Loader />}
                    {userInfo && userInfo.is_admin && !order.isDelivered && (
                        <ListGroup>
                            <Button
                                type='button'
                                className='btn btn-block'
                                onClick={deliverhandler}
                            >
                                Mark as Delivered
                            </Button>
                        </ListGroup>
                    )}

                </Card>
            </Col>
        </Row>
        </div>
    )
    }

export default OrderScreen
