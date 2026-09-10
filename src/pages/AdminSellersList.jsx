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
    const [sellers, setSellers] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("name");

    const [openRequirementModal, setOpenRequirementModal] = useState(false);
    const [selectedRequirement, setSelectedRequirement] = useState("");

    const fetchSellers = async () => {
        try {
            const res = await axios.get("/api/v1/admin/sellersList", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            
            const data = Array.isArray(res.data) ? res.data : res.data?.items || [];
            setSellers(data.map(s => ({
                id: s.id,
                fullName: s.fullName || `${s.firstName || ""} ${s.lastName || ""}`.trim(),
                email: s.email,
                phoneNumber: s.phoneNumber,
                country: s.country,
                approvalStatus: s.approvalStatus ?? s.status ?? s.state ?? "",
                createdAt: s.createdAt,
                requirement: s.requirement || s.description || "",
                _raw: s,
            })
        ));


        } catch (err) {
            console.error("Error fetching buyers:", err);
        }
    };

    useEffect(() => {
        fetchSellers();
    }, []);


    const filteredSellers = sellers.filter((seller) => {
        const term = searchTerm.toLowerCase();
        return (
            String(seller.fullName || "").toLowerCase().includes(term) ||
            String(seller.country || "").toLowerCase().includes(term) ||
            String(seller.email || "").toLowerCase().includes(term) ||
            String(seller.phoneNumber || "").toLowerCase().includes(term) ||
            String(seller.approvalStatus || "").toLowerCase().includes(term)
        );
    });

    const sortedSellers = [...filteredSellers].sort((a, b) => {
        if (sortBy === "name") {
            return String(a.fullName || "").localeCompare(String(b.fullName || ""));
        } else if (sortBy === "status") {
            return String(a.approvalStatus || "").toLowerCase().localeCompare(String(b.approvalStatus || "").toLowerCase());
        } else if (sortBy === "date") {
            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        }
        return 0;
    });


    const startIndex = (page - 1) * pageSize;
    const paginatedSellers = sortedSellers.slice(startIndex, startIndex + pageSize);
    const totalPages = Math.ceil(sortedSellers.length / pageSize);

    
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
                Sellers List
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
                        {paginatedSellers.map((seller) => (
                            <TableRow key={seller.id} hover>
                                <TableCell>{seller.fullName}</TableCell>
                                <TableCell>{seller.email}</TableCell>
                                <TableCell>{seller.phoneNumber}</TableCell>
                                <TableCell>{seller.country}</TableCell>
                                <TableCell>
                                    {seller.approvalStatus ? (
                                        <Chip
                                            label={seller.approvalStatus}
                                            color={statusChipColor(seller.approvalStatus)}
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
                                        onClick={() => handleOpenRequirement(seller.requirement)}
                                    >
                                        What we sell
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
                <DialogTitle>What we sell</DialogTitle>
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
