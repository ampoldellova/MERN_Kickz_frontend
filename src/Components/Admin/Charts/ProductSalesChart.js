import React, { useState, useEffect } from 'react';
import { getToken } from '../../../utils/helpers';
import axios from 'axios';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from 'recharts';

export default function ProductSalesChart({ data }) {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const barColors = [
        "#242424",
        "#FFB511",
        "#007FAE",
        "#3366E6",
        "#999966",
        "#809980",
        "#E6FF80",
        "#1AFF33",
        "#999933",
        "#FF3380",
        "#CCCC00",
        "#66E64D",
        "#4D80CC",
        "#FF4D4D",
        "#99E6E6"
    ];

    const productSales = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            };

            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/admin/product-sales`, config);
            setSales(data.totalPercentage);
        } catch (error) {
            setError(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        productSales();
    }, []);

    return (
        <ResponsiveContainer>
            <BarChart width={500} height={300} data={sales}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }}/>
                <Tooltip />
                <Bar dataKey="percent" fill="#8884d8">
                    {sales.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}
