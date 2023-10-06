import React, { useEffect, useState } from 'react'
import Layout from '../../component/Layout.jsx';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Col, Form, Input, Row, message, TimePicker } from 'antd';
import { hideLoading, showLoading } from '../../redux/features/alertSlice.jsx';
import moment from 'moment';

const DoctorProfile = () => {
    const { user } = useSelector((state) => state.user);
    const [doctor, setDoctor] = useState(null)
    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    //===============update doc=============//
    const handleFinish = async (values) => {
        try {
            dispatch(showLoading());
            const res = await axios.post(
                '/api/v1/doctor/updateProfile',
                {
                    ...values, userId: user._id,
                    timing: [
                        moment(values.timing[0]).format("HH:mm"),
                        moment(values.timing[1]).format("HH:mm"),
                    ],
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
            dispatch(hideLoading());
            if (res.data.success) {
                message.success(res.data.message);
                navigate("/");
            } else {
                message.error(res.data.success);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log(error);
            message.error('Something Went Wrong');
        }
    }
    //===============update doc=============//

    //getdoc details
    const getDoctorInfo = async () => {
        try {
            const res = await axios.post('/api/v1/doctor/getDoctorInfo', { userId: params.id }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (res.data.success) {
                setDoctor(res.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getDoctorInfo();
        // eslint-disable-next-line
    }, [])

    return (
        <Layout>
            <h1>Manage Profile</h1>
            {doctor && (
                <Form layout="vertical" onFinish={handleFinish} className="m-3" initialValues={{
                    ...doctor,
                    timing: [
                        moment(doctor.timing[0], "HH:mm"),
                        moment(doctor.timing[1], "HH:mm"),
                    ],
                }}>
                    <h4>Personal Details : </h4>
                    <Row gutter={20}>
                        <Col xs={24} md={24} lg={8}>
                            <Form.Item
                                label="First Name"
                                name="firstName"
                                required
                                rules={[{ required: true }]}
                            >
                                <Input type="text" placeholder="Your First Name" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={8}>
                            <Form.Item
                                label="Last Name"
                                name="lastName"
                                required
                                rules={[{ required: true }]}
                            >
                                <Input type="text" placeholder="Your Last Name" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={8}>
                            <Form.Item
                                label="Phone Number"
                                name="phone"
                                required
                                rules={[{ required: true }]}
                            >
                                <Input type="text" placeholder="Your Contact Number" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={8}>
                            <Form.Item
                                label="Email"
                                name="email"
                                required
                                rules={[{ required: true }]}
                            >
                                <Input type="email" placeholder="Your Email Address" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={8}>
                            <Form.Item
                                label="Website"
                                name="website"
                            >
                                <Input type="text" placeholder="Your Website" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={8}>
                            <Form.Item
                                label="Address"
                                name="address"
                                required
                                rules={[{ required: true }]}
                            >
                                <Input type="text" placeholder="Your Clinic Address" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <h4>Professional Details : </h4>
                    <Row gutter={20}>
                        <Col xs={24} md={24} lg={8}>
                            <Form.Item
                                label="Specialization"
                                name="specialization"
                                required
                                rules={[{ required: true }]}
                            >
                                <Input type="text" placeholder="Your Specialization" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={8}>
                            <Form.Item
                                label="Experience"
                                name="experience"
                                required
                                rules={[{ required: true }]}
                            >
                                <Input type="text" placeholder="Your Experience" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={8}>
                            <Form.Item
                                label="Fees Per Counsultation"
                                name="feesPerCounsultation"
                                required
                                rules={[{ required: true }]}
                            >
                                <Input type="text" placeholder="Your Counsultation Fees" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={8}>
                            <Form.Item
                                label="Timings"
                                name="timing"
                                required
                            >
                                <TimePicker.RangePicker format="HH:mm" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={8}></Col>
                        <Col xs={24} md={24} lg={8}>
                            <button className="btn btn-primary form-btn" type="submit">Update</button>
                        </Col>
                    </Row>
                </Form>
            )}
        </Layout>
    )
}

export default DoctorProfile
