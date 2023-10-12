import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap'
import Product  from '../components/Product'
import Loader  from '../components/Loader'
import Message  from '../components/Message'
import { listProducts } from '../actions/productActions'

function HomeScreen({history}) {
  const dispatch = useDispatch()
  const productList = useSelector(state => state.productList)
  const {error, loading, products} = productList

  const location = useLocation(); // Get the location object

  const keyword = new URLSearchParams(location.search).get('keyword')
  
  let q = '';

  if (keyword) {
    q = `?keyword=${keyword}`;
  }

  console.log(q)
  useEffect(() => {
    dispatch(listProducts(q))

  }, [dispatch, q])

  return (
    <div>
      <h1>Featured products</h1>
      {loading ? <Loader />
      
          : error ? <Message variant='danger'>{error}</Message>
              :
              <Row>
                {products.map(product => (
                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                    <Product product={product}/>
                </Col>
                ))}
              </Row>
      }        
    </div>
  )
}

export default HomeScreen
