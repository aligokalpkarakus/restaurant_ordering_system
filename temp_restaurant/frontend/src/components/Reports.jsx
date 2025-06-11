import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress
} from '@mui/material';
import { getReports, getSalesReport, getTableReport, getServerReport } from '../services/api';

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('today');
  const [salesData, setSalesData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [serverData, setServerData] = useState([]);
  const [summary, setSummary] = useState({
    totalSales: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    mostPopularItem: '',
    busiestTable: '',
    topServer: ''
  });

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const [salesResponse, tableResponse, serverResponse] = await Promise.all([
        getSalesReport(`/reports/sales?date_range=${dateRange}`),
        getTableReport(`/reports/tables?date_range=${dateRange}`),
        getServerReport(`/reports/servers?date_range=${dateRange}`)
      ]);

      setSalesData(salesResponse.data.sales);
      setTableData(tableResponse.data.tables);
      setServerData(serverResponse.data.servers);
      setSummary(salesResponse.data.summary);
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Reports</Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Date Range</InputLabel>
          <Select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            label="Date Range"
          >
            <MenuItem value="today">Today</MenuItem>
            <MenuItem value="yesterday">Yesterday</MenuItem>
            <MenuItem value="this_week">This Week</MenuItem>
            <MenuItem value="last_week">Last Week</MenuItem>
            <MenuItem value="this_month">This Month</MenuItem>
            <MenuItem value="last_month">Last Month</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Sales
              </Typography>
              <Typography variant="h5">
                ₺{summary.totalSales.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Orders
              </Typography>
              <Typography variant="h5">
                {summary.totalOrders}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Average Order Value
              </Typography>
              <Typography variant="h5">
                ₺{summary.averageOrderValue.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Most Popular Item
              </Typography>
              <Typography variant="h5">
                {summary.mostPopularItem}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Sales Report */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sales Report
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Time</TableCell>
                      <TableCell>Table</TableCell>
                      <TableCell>Server</TableCell>
                      <TableCell>Items</TableCell>
                      <TableCell>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {salesData.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell>{new Date(sale.created_at).toLocaleTimeString()}</TableCell>
                        <TableCell>Table {sale.table_number}</TableCell>
                        <TableCell>{sale.server_name}</TableCell>
                        <TableCell>{sale.items_count}</TableCell>
                        <TableCell>₺{sale.total.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Table Occupancy Report */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Table Occupancy Report
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Table</TableCell>
                      <TableCell>Orders</TableCell>
                      <TableCell>Total Sales</TableCell>
                      <TableCell>Average Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tableData.map((table) => (
                      <TableRow key={table.id}>
                        <TableCell>Table {table.table_number}</TableCell>
                        <TableCell>{table.orders_count}</TableCell>
                        <TableCell>₺{table.total_sales.toFixed(2)}</TableCell>
                        <TableCell>{table.average_time} min</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Server Performance Report */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Server Performance Report
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Server</TableCell>
                      <TableCell>Orders</TableCell>
                      <TableCell>Total Sales</TableCell>
                      <TableCell>Average Order</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {serverData.map((server) => (
                      <TableRow key={server.id}>
                        <TableCell>{server.name}</TableCell>
                        <TableCell>{server.orders_count}</TableCell>
                        <TableCell>₺{server.total_sales.toFixed(2)}</TableCell>
                        <TableCell>₺{server.average_order.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports; 