import React, { useEffect, useRef } from "react";
import List from '@material-ui/core/List';
import CSVReader from 'react-csv-reader';

import Scenario from "./Scenario";

function ScenarioHandler({ scenarios, setScenarios, id_score, clickedWaypointId }) {

  const defaultScenario = useRef({});

  const addNewScenario = (waypointId) => {

    let newScenario = { ...defaultScenario.current, ...scenarios[scenarios.length - 1] };
    newScenario.start_id = newScenario.end_id || 0;
    newScenario.end_id = waypointId;

    for (const scenario of scenarios) {
      if (scenario.end_id === waypointId) return false;
      if (scenario.end_id > waypointId && waypointId > scenario.start_id) {
        newScenario = { ...scenario };
        newScenario.end_id = waypointId;
        scenario.start_id = waypointId;
        break;
      }
    }
    if (newScenario.hasOwnProperty("start_id") && newScenario.hasOwnProperty("end_id")) {
      const sortedScenarios = [...scenarios, newScenario].slice().sort((a, b) => (a.start_id > b.start_id) ? 1 : (b.start_id > a.start_id) ? -1 : 0);
      setScenarios(sortedScenarios);
    }
  }

  useEffect(() => {
    const _defaultScenario = { speed_limit: 30 }
    for (const elem of id_score) {
      _defaultScenario[elem.contents] = 0;
    }
    defaultScenario.current = _defaultScenario;
  }, [id_score])

  useEffect(() => {
    // add new scenario
    if (clickedWaypointId) addNewScenario(clickedWaypointId);
  }, [clickedWaypointId])

  return (
    scenarios.length > 0 ?
      <List style={{ overflow: 'auto' }}>
        {scenarios.map((scenario, index) => <Scenario key={index} scenario={scenario} id_score={id_score} />)}
      </List>
      :
      <div>
        <CSVReader
          onFileLoaded={(data) => setScenarios(data)}
          parserOptions={{
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
          }}
        />
      </div>
  )
}

export default ScenarioHandler;