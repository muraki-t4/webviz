import React, { useState, useEffect } from "react";
import CSVReader from 'react-csv-reader';

function IDScoreHandler({ id_score, setIdScore }) {

  return (
    <div>
      { id_score.length === 0 &&
        <CSVReader
          onFileLoaded={(data) => setIdScore(data)}
          parserOptions={{
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
          }}
        />
      }
    </div>
  )
}

export default IDScoreHandler;