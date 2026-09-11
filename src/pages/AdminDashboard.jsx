import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

import ViewProductModal from "../modals/ViewProductModal";

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function AdminDashboard() {
  const [tab, setTab] = useState(0);
  const [buyers, setBuyers] = useState([]);
  const [ads, setAds] = useState([]);
  const [products, setProducts] = useState([]);

  // Search states
  const [buyerSearch, setBuyerSearch] = useState("");
  const [adSearch, setAdSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");

  // Pagination states
  const [buyerPage, setBuyerPage] = useState(0);
  const [adPage, setAdPage] = useState(0);
  const [productPage, setProductPage] = useState(0);
  const rowsPerPage = 5;

  // Details modal (view-only)
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [detailsView, setDetailsView] = useState({ type: null, data: null });

  // Action modal
  const [openActionModal, setOpenActionModal] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [actionTarget, setActionTarget] = useState({ type: "", id: "" });

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      const [buyersRes, adsRes, productsRes] = await Promise.all([
        axios.get("/api/v1/admin/buyers/pending", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("/api/v1/admin/ads/pending", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("/api/v1/admin/products/pending", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setBuyers(buyersRes.data);

      setAds(
        adsRes.data.map((a) => ({
          id: a.id,
          advertisementName: a.advertisementName,
          description: a.description,
          approvalStatus: a.approvalStatus,
          photoUrls: a.photoUrls || (a.imageUrl ? [a.imageUrl] : []),
        }))
      );

      setProducts(
        productsRes.data.map((p) => ({
          id: p.id,
          productName: p.productName,
          categoryName: p.category ? p.category.categoryName : "",
          description: p.description,
          approvalStatus: p.approvalStatus,
          photoUrls: p.photoUrls || [],
        }))
      );
    } catch (err) {
      console.error(
        "Error fetching data:",
        err.response ? err.response.data : err.message
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApproveReject = async () => {
    const { type, id } = actionTarget;
    try {
      await axios.post(`/api/v1/admin/${type}/${id}/${actionType}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOpenActionModal(false);
      fetchData();
    } catch (err) {
      console.error(`${actionType} error:`, err);
    }
  };

  const handleViewDetails = (type, row) => {
    setDetailsView({ type, data: row });
    setOpenDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setOpenDetailsModal(false);
    setDetailsView({ type: null, data: null });
  };

  const renderTable = (rows, columns, searchTerm, page, setPage, type) => {
    const filteredRows = rows.filter((row) =>
      Object.keys(columns).some((key) =>
        String(row[key] || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    );

    const paginatedRows = filteredRows.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );

    const isBuyerTable = type === "buyers";
    const viewTooltip = isBuyerTable ? "View Requirement" : "View Details";

    return (
      <>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          sx={{ mb: 2 }}
          value={searchTerm}
          onChange={(e) => {
            setPage(0);
            if (columns === buyerColumns) setBuyerSearch(e.target.value);
            if (columns === adColumns) setAdSearch(e.target.value);
            if (columns === productColumns) setProductSearch(e.target.value);
          }}
        />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{
                backgroundColor: "#888888", '& .MuiTableCell-root': {
                  color: "white"
                }
              }}>
                {Object.values(columns).map((label) => (
                  <TableCell
                    key={label}
                    sx={{
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      color: "#333",
                    }}
                  >
                    {label}
                  </TableCell>
                ))}
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    color: "#333",
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedRows.map((row, idx) => (
                <TableRow key={idx}>
                  {Object.keys(columns).map((key) => {
                    const value = row[key];

                    if (key === "description") {
                      return (
                        <TableCell key={key} sx={{ maxWidth: 260 }}>
                          <Tooltip title={value || ""} placement="top-start">
                            <Typography
                              variant="body2"
                              sx={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                display: "block",
                              }}
                            >
                              {value}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                      );
                    }

                    return <TableCell key={key}>{value}</TableCell>;
                  })}
                  <TableCell>
                    <Tooltip title={viewTooltip}>
                      <IconButton
                        onClick={() =>
                          isBuyerTable
                            ? handleViewDetails("buyers", row)
                            : handleViewDetails(type, row)
                        }
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Approve">
                      <IconButton
                        onClick={() => {
                          setActionType("approve");
                          setActionTarget({ type, id: row.id });
                          setOpenActionModal(true);
                        }}
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        <CheckCircleIcon color="success" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Reject">
                      <IconButton
                        onClick={() => {
                          setActionType("reject");
                          setActionTarget({ type, id: row.id });
                          setOpenActionModal(true);
                        }}
                        size="small"
                      >
                        <CancelIcon color="error" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filteredRows.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[rowsPerPage]}
        />
      </>
    );
  };

  const buyerColumns = {
    fullName: "Full Name",
    email: "Email Address",
    phoneNumber: "Phone Number",
    country: "Country",
    approvalStatus: "Approval Status",
  };

  const adColumns = {
    advertisementName: "Advertisement Name",
    description: "Description",
    approvalStatus: "Approval Status",
  };

  const productColumns = {
    productName: "Product Name",
    categoryName: "Category",
    description: "Description",
    approvalStatus: "Approval Status",
  };

  return (
    <Box sx={{ p: 3, mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Divider sx={{ my: 3, borderColor: "grey.700", borderBottomWidth: 2 }} />
      <Typography variant="h5" gutterBottom>
        Pending Approvals
      </Typography>
      <Tabs value={tab} onChange={(e, newVal) => setTab(newVal)}>
        <Tab label="Buyers" />
        <Tab label="Ads" />
        <Tab label="Products" />
      </Tabs>

      <TabPanel value={tab} index={0}>
        {renderTable(buyers, buyerColumns, buyerSearch, buyerPage, setBuyerPage, "buyers")}
      </TabPanel>

      <TabPanel value={tab} index={1}>
        {renderTable(ads, adColumns, adSearch, adPage, setAdPage, "ads")}
      </TabPanel>

      <TabPanel value={tab} index={2}>
        {renderTable(products, productColumns, productSearch, productPage, setProductPage, "products")}
      </TabPanel>

      <ViewProductModal
        open={openDetailsModal}
        onClose={closeDetailsModal}
        item={detailsView.data}
        type={detailsView.type}
      />

      <Dialog open={openActionModal} onClose={() => setOpenActionModal(false)}>
        <DialogTitle>{actionType === "approve" ? "Approve Item" : "Reject Item"}</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to {actionType} this {actionTarget.type ? actionTarget.type.slice(0, -1) : "item"}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenActionModal(false)}>Cancel</Button>
          <Button
            variant="contained"
            color={actionType === "approve" ? "success" : "error"}
            onClick={handleApproveReject}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
