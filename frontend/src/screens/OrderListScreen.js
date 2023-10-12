import React, { useState, useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Button, Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

import Loader  from '../components/Loader'
import Message  from '../components/Message'

import { listOrders } from '../actions/orderActions'
import { logout } from '../actions/userActions'

function OrderListScreen() {

  const dispatch = useDispatch()
  const history = useNavigate();

  const orderList = useSelector(state => state.orderList)
  const { loading, error, orders } = orderList

  const userLogin = useSelector(state => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() =>{
      if(userInfo && userInfo.is_admin){
        dispatch(listOrders())
      }else{
        history('/login')
        dispatch(logout())
      }
  },[dispatch], history, userInfo)

 return (
    <div>
      <h1>
        All orders
      </h1>

      {loading  
        ? (<Loader />) 
        : error  
          ? (<Message variant='danger'>{error}</Message>)
          : (
              <Table striped bordered hover responsive className='table-sm'>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Paid</th>
                    <th>Delivered</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map(order => (
                    <tr key={order._id}>
                      <td>{order._id}</td>
                      <td>{order.user && order.user.name}</td>
                      <td>{order.createdAt.substring(0, 10)}</td>
                      <td>{order.totalPrice}</td>
                      
                      <td>{order.isPaid ? (
                                order.paidAt.substring(0, 10)
                            ) : (
                                <i className='fa-solid fa-x' style={{color: 'red'}}></i>
                            )}
                      </td>

                      <td>{order.isDelivered ? (
                                order.deliveredAt.substring(0, 10)
                            ) : (
                                <i className='fa-solid fa-x' style={{color: 'red'}}></i>
                            )}
                       </td>

                      <td>
                        <LinkContainer to={`/order/${order._id}`}>
                          <Button variant='light' className='btn-sm'>
                            Details
                          </Button>
                        </LinkContainer>
                      </td>
                    </tr>

                  ))}
                </tbody>
              </Table>
        )}

    </div>
  )
}

export default OrderListScreen
