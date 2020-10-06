import React, { useState } from "react";
import List from '@material-ui/core/List';
import { Container, Draggable } from 'react-smooth-dnd';
import CSVReader from 'react-csv-reader';
import arrayMove from 'array-move';

import Scenario from "./Scenario";

function ScenarioList() {

  const [scenarios, setScenarios] = useState([]);

  const onDrop = ({ removedIndex, addedIndex }) => {
    setScenarios(scenarios => arrayMove(scenarios, removedIndex, addedIndex))
  };

  return (
    scenarios.length > 0 ?
      <List>
        <Container dragHandleSelector=".drag-handle" lockAxis="y" onDrop={onDrop}>
          {
            scenarios.map((scenario, index) =>
              <Draggable key={index}>
                <Scenario key={index} scenario={scenario} />
              </Draggable>
            )
          }
        </Container>
      </List>
      :
      <div>
        <CSVReader
          onFileLoaded={(data) => { setScenarios(data); console.log(data); }}
          parserOptions={{
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
          }}
        />
      </div>
  )
}

export default ScenarioList;