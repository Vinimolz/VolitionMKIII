import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Row, Col, Image, ListGroup, Button, Card, Form, ListGroupItem } from 'react-bootstrap'
import Rating from '../components/Rating'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { listProductsDetails, createProductReview } from '../actions/productActions'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants'

function ProductScreen({ match }) {
  const [qty, setQty] = useState(1)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')


  const { id } = useParams();
  const history = useNavigate();
  const dispatch = useDispatch()

  const productDetails = useSelector(state => state.productDetails)
  const { loading, error, product } = productDetails

  const userLogin = useSelector(state => state.userLogin)
  const { userInfo } = userLogin

  const productReviewCreate = useSelector(state => state.productReviewCreate)
  const { loading:loadingProductReview, error:errorProductReview, success:successProductReview } = productReviewCreate

  useEffect(() => {

    if(successProductReview){
      setRating(0)
      setComment('')
      dispatch({type:PRODUCT_CREATE_REVIEW_RESET})
    }

    dispatch(listProductsDetails(id))

  }, [dispatch, successProductReview])

  const addToCartHandler = () => {

    if(!qty){
      qty = 1
    }
    
    history(`/cart/${id}?qty=${qty}`)
  }

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(createProductReview(
      id, {rating, comment}
    ))
  }

  return (
    <div>
      <Link to='/' className='mb-2 btn btn-dark my-'>Go Back</Link>
      {loading ? <Loader />
      
          : error ? <Message variant='danger'>{error}</Message>
              : (
              <div>
                <Row className='mb-5'>
                  <Col md={6}>
                    <Image src={product.image} alt={product.name} fluid />
                  </Col>

                <Col md={3}>
                  <ListGroup variant='flush'>

                    <ListGroup.Item>
                      <h3>{product.name}</h3>
                    </ListGroup.Item>

                    <ListGroup.Item>
                      <Rating value={product.rating} text={`${product.numReviews} reviews`} color={'#f8e825'}/>
                    </ListGroup.Item>

                    <ListGroup.Item>
                      Price: ${product.price}
                    </ListGroup.Item>

                    <ListGroup.Item>
                      Description: {product.description}
                    </ListGroup.Item>

                  </ListGroup>
                </Col>

                <Col md={3}>
                  <Card>
                    <ListGroup variant='flush'>
                      <ListGroup.Item>
                        <Row>
                          <Col>Price: </Col>
                          <Col><strong>${product.price}</strong></Col>
                        </Row>
                      </ListGroup.Item>

                      <ListGroup.Item>
                        <Row>
                          <Col>Status: </Col>
                          <Col>
                          {product.countInStock > 0 ? 'In Stock' : 'Out of stock' }
                          </Col>
                        </Row>
                      </ListGroup.Item>

                      
                        {product.countInStock > 0 && (
                          <ListGroupItem>
                            <Row>
                              <Col>
                                Qty
                              </Col>
                              <Col xs='auto' className='my-1'>
                                <Form.Control 
                                  as="select"  
                                  value={qty} 
                                  onChange={(e) => setQty(e.target.value)}
                                >

                                  {
                                    [...Array(product.countInStock).keys()].map((x) => (
                                      <option key={x + 1} value={x + 1}>
                                        {x + 1}
                                      </option>
                                    ))
                                  }

                                </Form.Control>
                              </Col>
                            </Row>
                          </ListGroupItem>                          
                        )}

                          <ListGroupItem>
                            <Row>
                              <Col>
                                Size
                              </Col>
                              <Col xs='auto' className='my-1'>
                                <Form.Control 
                                  as="select"  
                                >
                                  <option>Choose Size</option>
                    
                                  <option>US 6</option>
                                  <option>US 7</option>
                                  <option>US 8</option>
                                  <option>US 9</option>
                                  <option>US 10</option>
                                  <option>US 11</option>
                                  <option>US 12</option>
                                  <option>US 13</option>

                                </Form.Control>
                              </Col>
                            </Row>
                          </ListGroupItem>
                      

                      <ListGroup.Item>
                        <Button
                          
                          className='btn-block' 
                          disabled={product.countInStock == 0} 
                          type='button'
                          onClick={addToCartHandler}
                          >
                          Add to cart</Button>
                      </ListGroup.Item>

                    </ListGroup>
                  </Card>
                </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <h4>Reviews</h4>
                        {product.reviews.length === 0 && <Message variant='info'>This item does not have any reviews</Message>}
                        
                        <ListGroup variant='flush'>
                          {product.reviews.map((review) => (
                            <ListGroup.Item key={review._id}>
                              <strong>{review.name}</strong>
                              <Rating value={review.rating} color='#f8e825'></Rating>
                              <p>{review.createdAt.substring(0, 10)}</p>
                              <p>{review.comment}</p>
                            </ListGroup.Item>
                          ))}
                        </ListGroup> 
                    </Col>
                    <Col md={6}>
                        <ListGroup>
                          <ListGroup.Item>
                            <h4>Write a review yourself</h4>

                            {loadingProductReview && <Loader/>}
                            {successProductReview && <Message variant='success'>Comment submitted successfully</Message>}
                            {errorProductReview && <Message variant='danger'>{errorProductReview}</Message>}


                            {userInfo ? (
                              <Form onSubmit={submitHandler}>
                                <Form.Group controlId='rating'>
                                  <Form.Label>Rating</Form.Label>
                                  <Form.Control 
                                    as='select'
                                    value={rating}
                                    onChange={(e) => setRating(e.target.value)}
                                  >
                                    <option value=''>Select...</option>
                                    <option value='1'>1 - Poor</option>
                                    <option value='2'>2 - Fair</option>
                                    <option value='3'>3 - Good</option>
                                    <option value='4'>4 - Very Good</option>
                                    <option value='5'>5 - Excellent</option>
                                  </Form.Control>
                                </Form.Group>

                                <Form.Group>
                                  <Form.Label>Comment</Form.Label>
                                  <Form.Control
                                    as='textarea'
                                    rows='5'
                                    value = {comment}
                                    onChange = {(e) => setComment(e.target.value)}
                                  >

                                  </Form.Control>
                                </Form.Group>

                                <Button
                                  className='mt-3'
                                  disabled = {loadingProductReview}
                                  type = 'submit'
                                  variant='primary'
                                  on
                                >
                                  Submit review
                                </Button>

                              </Form>
                            ) : (
                              <Message variant='info'>Please <Link to='/login'>login</Link> to write a review</Message>
                            )}
                          </ListGroup.Item>
                        </ListGroup>                    
                    </Col>
                </Row>
              </div>
              )
          } 
    </div>
  )
}

export default ProductScreen
