import React, { useEffect, useState } from 'react';
import Layout from '../component/Layout.jsx';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { DatePicker, TimePicker, message } from 'antd';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { hideLoading, showLoading } from '../redux/features/alertSlice.jsx';


const BookingPage = ({ doctor }) => {
    // eslint-disable-next-line
    const { user } = useSelector((state) => state.user);
    const [doctors, setDoctors] = useState([]);
    const params = useParams();
    const [date, setDate] = useState();
    const [time, setTime] = useState();
    // eslint-disable-next-line
    const [isAvailable, setIsAvailable] = useState();
    const dispatch = useDispatch();

    //login user data
    const getUserData = async () => {
        try {
            // eslint-disable-next-line
            const res = await axios.post(
                "/api/v1/doctor/getDoctorById",
                { doctorId: params.doctorId },
                {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                }
            );
            if (res.data.success) {
                setDoctors(res.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    }
    //login user data


    const handleAvailability = async () => {
        try {
            dispatch(showLoading());
            const res = await axios.post('/api/v1/user/booking-availbility',
                { doctorId: params.doctorId, date, time },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                },
            );
            dispatch(hideLoading());
            if (res.data.success) {
                setIsAvailable(true);
                message.success(res.data.message);
            } else {
                message.error(res.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log(error);
        }
    }

    //=============handle booking==================//
    const handleBooking = async () => {
        try {
            setIsAvailable(true);
            if (!date && !time) {
                return alert("Date & Time Required");
            }
            dispatch(showLoading());
            const res = await axios.post('/api/v1/user/book-appointment',
                {
                    doctorId: params.doctorId,
                    userId: user._id,
                    doctorInfo: doctors,
                    date: date,
                    userInfo: user,
                    time: time,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                },
            );
            dispatch(hideLoading());
            if (res.data.success) {
                message.success(res.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log(error);
        }
    }
    //=============handle booking==================//

    useEffect(() => {
        getUserData();
        // eslint-disable-next-line
    }, []);

    return (
        <Layout>
            <h3>Book Appointment</h3>
            <div className="container m-2">
                {doctors && (
                    <div>
                        <h4>
                            Name :- Dr.{doctors.firstName} {doctors.lastName}
                        </h4>
                        <h4>Fees :- {doctors.feesPerCounsultation}</h4>
                        <h4>Specialist :- {doctors.specialization}</h4>
                        <h4>
                            Timings :-
                            {/* {doctors.timing[0]} - {doctors.timing[1]} */}
                            {doctors.timing}
                        </h4>
                        <div className="d-flex flex-column w-50">
                            <DatePicker className="m-2" format="DD-MM-YYYY" onChange={(value) => {
                                setDate(moment(value).format('DD-MM-YYYY'));
                            }} />
                            <TimePicker className="m-2" format="HH:mm" onChange={(value) => {
                                setTime(moment(value).format("HH:mm"));
                            }} />
                            <button className="btn btn-primary mt-2" onClick={handleAvailability}>Check Availability</button>
                            <button className="btn btn-dark mt-2" onClick={handleBooking}>Book Now</button>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    )
}

export default BookingPage
