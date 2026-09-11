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
    DialogActions
} from "@mui/material";
import axios from "axios";

export default function AdminAdvertisersList() {
    const [advertisers, setAdvertisers] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("name");

    const [openRequirementModal, setOpenRequirementModal] = useState(false);
    const [selectedRequirement, setSelectedRequirement] = useState("");

    const fetchAdvertisers = async () => {
        try {
            const res = await axios.get("/api/v1/admin/advertisersList", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setAdvertisers(res.data);
        } catch (err) {
            console.error("Error fetching buyers:", err);
        }
    };

    useEffect(() => {
        fetchAdvertisers();
    }, []);

  
    const filteredAdvertisers = advertisers.filter((advertiser) => {
        const term = searchTerm.toLowerCase();
        return (
            advertiser.fullName?.toLowerCase().includes(term) ||
            advertiser.country?.toLowerCase().includes(term) ||
            advertiser.email?.toLowerCase().includes(term) ||
            advertiser.phoneNumber?.toLowerCase().includes(term)
        );
    });

    const sortedAdvertisers = [...filteredAdvertisers].sort((a, b) => {
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
    const paginatedAdvertisers = sortedAdvertisers.slice(startIndex, startIndex + pageSize);
    const totalPages = Math.ceil(sortedAdvertisers.length / pageSize);

    // Handlers for requirement modal
    const handleOpenRequirement = (requirement) => {
        setSelectedRequirement(requirement || "No requirements provided");
        setOpenRequirementModal(true);
    };
    const handleCloseRequirement = () => {
        setOpenRequirementModal(false);
        setSelectedRequirement("");
    };

    return (
        <Box sx={{ p: 3, mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Advertisers List
            </Typography>
            <Divider sx={{ my: 3, borderColor: "grey.700", borderBottomWidth: 2 }} />

            {/* Controls row */}
           <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, mb: 3 }}>
                <TextField
                    label="Search Advertiser by Name, Country, Email, Phone, or Status"
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
            <TableContainer component={Paper} sx={{ p: 3, mt: 4 , justifyContent: "center"}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Full Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Country</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedAdvertisers.map((advertiser) => (
                            <TableRow key={advertiser.id} hover>
                                <TableCell>{advertiser.fullName}</TableCell>
                                <TableCell>{advertiser.email}</TableCell>
                                <TableCell>{advertiser.phoneNumber}</TableCell>
                                <TableCell>{advertiser.country}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4, p: 2 }}>
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(e, value) => setPage(value)}
                    color="primary"
                />
            </Box>

            {/* Requirement Modal */}
            <Dialog open={openRequirementModal} onClose={handleCloseRequirement}>
                <DialogTitle>Advertiser Requirement</DialogTitle>
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
