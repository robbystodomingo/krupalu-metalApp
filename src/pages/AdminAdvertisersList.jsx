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

            const data = Array.isArray(res.data) ? res.data : res.data?.items || [];
            setAdvertisers(data.map(a => ({
                id: a.id,
                fullName: a.fullName || `${a.firstName || ""} ${a.lastName || ""}`.trim(),
                email: a.email,
                phoneNumber: a.phoneNumber,
                country: a.country,
                approvalStatus: a.approvalStatus ?? a.status ?? a.state ?? "",
                createdAt: a.createdAt,
                requirement: a.requirement || a.description || "",
                _raw: a,
            })
        ));
        } catch (err) {
            console.error("Error fetching advertisers:", err);
        }
    };

    useEffect(() => {
        fetchAdvertisers();
    }, []);


    const filteredAdvertisers = advertisers.filter((advertiser) => {
        const term = searchTerm.toLowerCase();
        return (
            String(advertiser.fullName || "").toLowerCase().includes(term) ||
            String(advertiser.country || "").toLowerCase().includes(term) ||
            String(advertiser.email || "").toLowerCase().includes(term) ||
            String(advertiser.phoneNumber || "").toLowerCase().includes(term) ||
            String(advertiser.approvalStatus || "").toLowerCase().includes(term)
        );
    });

    const sortedAdvertisers = [...filteredAdvertisers].sort((a, b) => {
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

    function statusChipColor(status) {
        const s = String(status || "").toLowerCase();
        if (s.includes("approve") || s.includes("approved")) return "success";
        if (s.includes("reject") || s.includes("rejected")) return "error";
        return "warning";
    }

    return (
        <Box sx={{ p: 3, mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Advertisers List
            </Typography>
            <Divider sx={{ my: 3, borderColor: "grey.700", borderBottomWidth: 2 }} />

            {/* Controls row */}
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
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
                        {paginatedAdvertisers.map((advertiser) => (
                            <TableRow key={advertiser.id} hover>
                                <TableCell>{advertiser.fullName}</TableCell>
                                <TableCell>{advertiser.email}</TableCell>
                                <TableCell>{advertiser.phoneNumber}</TableCell>
                                <TableCell>{advertiser.country}</TableCell>
                                <TableCell>
                                    {advertiser.approvalStatus ? (
                                        <Chip
                                            label={advertiser.approvalStatus}
                                            color={statusChipColor(advertiser.approvalStatus)}
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
                                        onClick={() => handleOpenRequirement(advertiser.requirement)}
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
