import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, Button, Divider, IconButton } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import Slider from "react-slick";
import axios from "axios";

const AdvertisementDetailModal = ({ open = false, handleClose, advertisementId, onPostDeleted, onEdit }) => {
    const [advertisement, setAdvertisement] = useState(null);

    useEffect(() => {
        if (!open || !advertisementId) return;

        const token = localStorage.getItem("token");
        axios
            .get(`/api/v1/advertiserDashboard/advertisements/${advertisementId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setAdvertisement(res.data))
            .catch((err) => console.error("Error fetching advertisement:", err));
    }, [open, advertisementId]);

    if (!advertisementId) return null;

    // Custom arrow components
    const NextArrow = (props) => {
        const { onClick } = props;
        return (
            <IconButton
                onClick={onClick}
                sx={{ position: "absolute", right: -25, top: "40%", zIndex: 1 }}
            >
                <ArrowForwardIos />
            </IconButton>
        );
    };

    const PrevArrow = (props) => {
        const { onClick } = props;
        return (
            <IconButton
                onClick={onClick}
                sx={{ position: "absolute", left: -25, top: "40%", zIndex: 1 }}
            >
                <ArrowBackIos />
            </IconButton>
        );
    };

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
    };

    const handleDelete = () => {
        const token = localStorage.getItem("token");
        axios
            .delete(`/api/v1/advertiserDashboard/advertisements/${advertisementId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(() => {
                onPostDeleted(advertisementId);
                handleClose();
            })
            .catch((err) => console.error("Error deleting advertisement:", err));
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 600,
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                }}
            >
                {/* Carousel for product photos */}
                {/* Carousel for product photos */}
                {advertisement?.photoUrls?.length > 0 && (
                    <Slider {...settings}>
                        {advertisement.photoUrls.map((photo, index) => (
                            <Box key={index} sx={{ textAlign: "center" }}>
                                <img
                                    src={photo}
                                    alt={`${advertisement?.advertisementName || "Advertisement"} ${index + 1}`}
                                    style={{
                                        width: "100%",
                                        maxHeight: "300px",
                                        objectFit: "cover",
                                        borderRadius: 8,
                                    }}
                                />
                            </Box>
                        ))}
                    </Slider>
                )}

                {/* Product details */}
                <Typography variant="h6" mt={3}>
                    {advertisement?.advertisementName || ""}
                </Typography>
                <Typography variant="body1" mt={2}>
                    {advertisement?.description || ""}
                </Typography>


                <Divider sx={{ my: 3, borderColor: "grey.700", borderBottomWidth: 2 }} />

                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
                    <Button variant="contained" color="error" onClick={handleDelete}>
                        Delete Advertisement
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            onEdit(advertisement);
                            handleClose();
                        }}
                    >
                        Edit Advertisement
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default AdvertisementDetailModal;
