import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Pagination,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Chip,
} from "@mui/material";
import axios from "axios";

export default function AdminBuyersList() {
    const [buyers, setBuyers] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("name");

    const [openRequirementModal, setOpenRequirementModal] = useState(false);
    const [selectedRequirement, setSelectedRequirement] = useState("");

    const fetchBuyers = async () => {
        try {
            const res = await axios.get("/api/v1/admin/buyersList", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setBuyers(res.data);
        } catch (err) {
            console.error("Error fetching buyers:", err);
        }
    };

    useEffect(() => {
        fetchBuyers();
    }, []);

  
    const filteredBuyers = buyers.filter((buyer) => {
        const term = searchTerm.toLowerCase();
        return (
            buyer.fullName?.toLowerCase().includes(term) ||
            buyer.country?.toLowerCase().includes(term) ||
            buyer.email?.toLowerCase().includes(term) ||
            buyer.phoneNumber?.toLowerCase().includes(term) ||
            buyer.approvalStatus?.toLowerCase().includes(term)
        );
    });

    const sortedBuyers = [...filteredBuyers].sort((a, b) => {
        if (sortBy === "name") {
            return a.fullName?.localeCompare(b.fullName);
        } else if (sortBy === "status") {
            return a.approvalStatus?.toLowerCase().localeCompare(b.approvalStatus?.toLowerCase());
        } else if (sortBy === "date") {
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return 0;
    });

    const startIndex = (page - 1) * pageSize;
    const paginatedBuyers = sortedBuyers.slice(startIndex, startIndex + pageSize);
    const totalPages = Math.ceil(sortedBuyers.length / pageSize);

    // Handlers for requirement modal
    const handleOpenRequirement = (requirement) => {
        setSelectedRequirement(requirement || "No requirements provided");
        setOpenRequirementModal(true);
    };
    const handleCloseRequirement = () => {
        setOpenRequirementModal(false);
        setSelectedRequirement("");
    };

    function statusChipColor(status) {
        const s = String(status || "").toLowerCase();
        if (s.includes("approve") || s.includes("approved")) return "success";
        if (s.includes("reject") || s.includes("rejected")) return "error";
        return "warning";
    }

    return (
        <Box sx={{ p: 3, mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Buyers List
            </Typography>
            <Divider sx={{ my: 3, borderColor: "grey.700", borderBottomWidth: 2 }} />

            {/* Controls row */}
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                <TextField
                    label="Search Buyer by Name, Country, Email, Phone, or Status"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setPage(1);
                    }}
                    sx={{ width: 400 }}
                />

                <FormControl size="medium" sx={{ minWidth: 150 }}>
                    <InputLabel>Sort By</InputLabel>
                    <Select
                        value={sortBy}
                        label="Sort By"
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <MenuItem value="name">Name</MenuItem>
                        <MenuItem value="status">Status</MenuItem>
                        <MenuItem value="date">Date</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Full Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Country</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedBuyers.map((buyer) => (
                            <TableRow key={buyer.id} hover>
                                <TableCell>{buyer.fullName}</TableCell>
                                <TableCell>{buyer.email}</TableCell>
                                <TableCell>{buyer.phoneNumber}</TableCell>
                                <TableCell>{buyer.country}</TableCell>
                                <TableCell>
                                    {buyer.approvalStatus ? (
                                        <Chip
                                            label={buyer.approvalStatus}
                                            color={statusChipColor(buyer.approvalStatus)}
                                            size="small"
                                        />
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">Pending</Typography>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        color="info"
                                        size="small"
                                        sx={{ mr: 1 }}
                                        onClick={() => handleOpenRequirement(buyer.requirement)}
                                    >
                                        View Requirement
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4, p: 2 }}>
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(e, value) => setPage(value)}
                    color="primary"
                />
            </Box>

            {/* Requirement Modal */}
            <Dialog open={openRequirementModal} onClose={handleCloseRequirement}>
                <DialogTitle>Buyer Requirement</DialogTitle>
                <DialogContent>
                    <Typography>{selectedRequirement}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseRequirement} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
