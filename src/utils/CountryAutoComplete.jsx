import React from "react";
import { Autocomplete, TextField } from "@mui/material";
import { allCountries } from "country-region-data";

export default function CountryAutocomplete({ value, onChange }) {
  // Extract just the country names from the dataset
  const countries = allCountries; // array of { countryName, countryShortCode, regions }

  return (
    <Autocomplete
    options={countries}
    value={value}
    onChange={(event, newValue) => onChange(newValue)}
    getOptionLabel={(option) => option?.countryName || ""}
    renderInput={(params) => <TextField {...params} label="Country" required />}
    />
  );
}
