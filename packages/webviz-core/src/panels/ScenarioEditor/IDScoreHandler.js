import React from "react";
import Typography from '@material-ui/core/Typography';
import CSVReader from 'react-csv-reader';

function IDScoreHandler({ id_score, setIdScore }) {

  return (
    id_score.length === 0 &&
    <>
      <Typography variant="h6">id_score.csv</Typography>
      <CSVReader
        onFileLoaded={(data) => setIdScore(data)}
        parserOptions={{
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
        }}
      />
    </>
  )
}

export default IDScoreHandler;