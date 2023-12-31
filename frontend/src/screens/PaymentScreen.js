import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Button, Form, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { savePaymentMethod } from '../actions/cartActions'
import FormContainer  from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'

function PaymentScreen() {

    const cart = useSelector(state => state.cart)
    const { shippingAddress } = cart

    const dispatch = useDispatch()
    const history = useNavigate()

    const [paymentMethod, setPaymentMethod] = useState('PayPal')

    if(!shippingAddress.address){
        history('/shipping')
    }

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(savePaymentMethod(paymentMethod))
        history('/placeorder')
    }

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
        <Form onSubmit={submitHandler}>

            <Form.Group>
                <Form.Label as='legend'>Select Method</Form.Label>
                <Col>
                    <Form.Check
                        type='radio'
                        label='PayPal or CreditCard'
                        id='paypal'
                        name='paymentMethod'
                        checked
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                    </Form.Check>
                
                </Col>
            </Form.Group>

            <Button type='submit' variant='primary'>
                Continue
            </Button>

        </Form>
    </FormContainer>
  )
}

export default PaymentScreen
