import React, { useState, useEffect } from 'react'
import { useTheme } from '@mui/material/styles';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getToken } from '../../../utils/helpers';
import axios from "axios";

export default function MonthlySalesChart() {
    const [sales, setSales] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const theme = useTheme();

    const monthlySales = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            }

            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/admin/sales-per-month`, config)
            setSales(data.salesPerMonth)
            setLoading(false)

        } catch (error) {
            setError(error.response.data.message)
        }
    }
    useEffect(() => {
        monthlySales()

    }, [])

    return (
        <ResponsiveContainer>
            <LineChart width={600} height={300} data={sales} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <Line type="monotone" dataKey="total" stroke={theme.palette.primary.main} dot={false} />
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="month" stroke={theme.palette.text.secondary} style={theme.typography.body2} />
                <YAxis stroke={theme.palette.text.secondary} style={theme.typography.body2} />
                <Tooltip />
            </LineChart>
        </ResponsiveContainer>


    );
}