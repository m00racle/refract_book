/*  
page to handle report
*/
import * as React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from "next/router";
import Head from 'next/head';
import PageNavBar from '../../../components/BookNavBar';
import { Box, Tab, Tabs, Typography } from "@mui/material";


function ReportPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="reportpanel"
            hidden={value !== index}
            id={`reportpanel-${index}`}
            aria-labelledby={`report-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: "1em"}}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

// specify the ReportPanel props contains:
ReportPanel.propTypes = {
    children:PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

// ally props for aria
function allyProps(index) {
    return {
        id: `report-tab-${index}`,
        'aria-controls': `reportpanel-${index}`,
    };
}

export default function DocumentPage() {
    const router = useRouter();
    const { bookId } = router.query;
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        // NOTE: the newValue argument is only available for Tabs React component
        // WARNING: for other component consult to the docs before attempting to pull newValue as parameter
        setValue(newValue);
    };
    
    const formattedBookId = bookId ? bookId.toString() : '';

    return (
        <>
        <Head>
            <title>{`Transaction ${formattedBookId}`}</title>
        </Head>
        <PageNavBar bookId={formattedBookId} />
        <div>
            <h1>Report for Book ID: {formattedBookId}</h1>
        </div>
        <Box sx={{ width: '100%'}}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label='report tabs'>
                    <Tab label="Neraca" {...allyProps(0)} />
                    <Tab label="Laporan Laba Rugi" {...allyProps(1)}/>
                    <Tab label="Laporan Arus Kas" {...allyProps(2)}/>
                    <Tab label="Laporan Laba Ditahan" {...allyProps(3)}/>
                </Tabs>
            </Box>
            <ReportPanel value={value} index={0}>
                Neraca
            </ReportPanel>
            <ReportPanel value={value} index={1}>
                Laporan Laba Rugi
            </ReportPanel>
            <ReportPanel value={value} index={2}>
                Laporan Arus Kas
            </ReportPanel>
            <ReportPanel value={value} index={3}>
                Laporan Laba Ditahan
            </ReportPanel>
            
        </Box>
        </>
    );
}