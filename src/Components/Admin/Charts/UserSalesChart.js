import React, { useState, useEffect } from 'react';
import {
    PieChart,
    Pie,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';
import { getToken } from '../../../utils/helpers';
import axios from 'axios';

const UserSalesChart = () => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const userSales = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            };

            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/admin/customer-sales`, config);
            setSales(data.customerSales);
            setLoading(false);
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    const pieColors = ["#1f77b4", "#ff7f0e", "#2ca02c"];

    useEffect(() => {
        userSales();
    }, []);
    console.log(sales)
    return (
        <ResponsiveContainer>
            <PieChart>
                <Tooltip formatter={(value, _id, props) => [`₱ ${value}`, _id]} />
                <Pie
                    data={sales}
                    dataKey="total"
                    nameKey="_id"
                    outerRadius={100}
                    fill="#8884d8"
                >
                    {
                        sales && sales.map((item, index) => (
                            <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                        ))
                    }
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    );
};

export default UserSalesChart;
