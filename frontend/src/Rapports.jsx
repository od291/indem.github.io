import React, { useState } from 'react';
import axios from 'axios';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

function Rapports() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!startDate || !endDate) {
      setError('Les dates de début et de fin sont requises.');
      return;
    }

    try {
      const response = await axios.get('http://localhost:3000/rapports', {
        params: { startDate, endDate },
      });

      const { results, totalAmount } = response.data;

      setReportData(results);
      setTotalAmount(totalAmount);
      setError(null);
    } catch (error) {
      console.error('Erreur lors de la récupération des rapports:', error);
      setError('Erreur lors de la récupération des rapports. Veuillez réessayer.');
    }
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setReportData([]);
    setTotalAmount(0);
    setError(null);
  };

  // Function to generate PDF document
  const generatePDF = () => (
    <Document>
      <Page style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.header}>Rapports du</Text>
          <Text style={styles.date}>{startDate}</Text>
          <Text style={styles.header2}>au</Text>
          <Text style={styles.date}>{endDate}</Text>
        </View>
        <View style={styles.section1}>
          <Text style={styles.header3}>Nom personnel</Text>
          <Text style={styles.header3}>Type indemnité</Text>
          <Text style={styles.header3}>Montant</Text>
          <Text style={styles.header3}>Date attribution</Text>
          <Text style={styles.header3}>Cause</Text>
        </View>
        {reportData.map((indemnity, index) => (
          <View style={styles.section} key={index}>
            <Text style={styles.header4}>{indemnity.nom_pers}</Text>
            <Text style={styles.header4}>{indemnity.type}</Text>
            <Text style={styles.header4}>{indemnity.montant}</Text>
            <Text style={styles.header4}>{indemnity.date_attr}</Text>
            <Text style={styles.header4}>{indemnity.cause}</Text>
          </View>
        ))}
        <View style={styles.total}>
          <Text>Montant total des indemnités: {totalAmount}</Text>
        </View>
      </Page>
    </Document>
  );

  // Styles for PDF document
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      padding: 10,
    },
    section1: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#AAAAAA',
      alignItems: 'center',
      padding: 8,

    },
    header3: {
      marginRight: 8,

    },
    header4:{
      marginRight: 30,

    },
  
    section: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#AAAAAA',
      alignItems: 'center',
      padding: 8,
    },
    header: {
      fontSize: 18,
      marginBottom: 10,
      textAlign: 'center',
      marginRight: 20,
    },
    header2: {
      fontSize: 18,
      marginBottom: 10,
      textAlign: 'center',
      marginRight: 10,
    },
    date: {
      marginBottom: 5,
      marginRight: 10,
    },
    total: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 10,
    },
  });

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>Rapports</h3>
      </div>
      <div className="search-container">
        <label>
          Date de début:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          Date de fin:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
        <button onClick={handleSearch}>Rechercher</button>
        <button onClick={handleReset}>Réinitialiser</button>
        {reportData.length > 0 && (
          <PDFDownloadLink document={generatePDF()} fileName="rapports.pdf">
            {({ blob, url, loading, error }) =>
              loading ? 'Chargement...' : 'Exporter en PDF'
            }
          </PDFDownloadLink>
        )}
      </div>
      {error && <div className="error-message">{error}</div>}
      <table>
        <thead>
          <tr>
            <th>Nom du Personnel</th>
            <th>Type d'indemnité</th>
            <th>Montant</th>
            <th>Date d'attribution</th>
            <th>Cause</th>
          </tr>
        </thead>
        <tbody>
          {reportData.map((indemnity, index) => (
            <tr key={index}>
              <td>{indemnity.nom_pers}</td>
              <td>{indemnity.type}</td>
              <td>{indemnity.montant}</td>
              <td>{indemnity.date_attr}</td>
              <td>{indemnity.cause}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="total-amount">
        Montant total des indemnités: {totalAmount}
      </div>
    </main>
  );
}

export default Rapports;
