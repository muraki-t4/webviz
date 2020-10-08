import React, { useEffect, useState } from "react";
import List from '@material-ui/core/List';
import CSVReader from 'react-csv-reader';

import Scenario from "./Scenario";

function ScenarioHandler({ scenarios, setScenarios, clickedWaypointId }) {

  const addNewScenario = (waypointId) => {
    let newScenario = {
      speed_limit: 30,
    };
    // ignore duplicate waypoint
    if (scenarios.filter(scenario => scenario.start_id === waypointId).length > 0) return false;
    // insert first
    if (scenarios.filter(scenario => waypointId > scenario.start_id).length === 0) {
      newScenario.start_id = 0;
      newScenario.end_id = waypointId;
    }
    else {
      for (const [index, scenario] of scenarios.entries()) {
        // insert between
        if (scenario.start_id > waypointId) {
          newScenario = { ...scenarios[index - 1] };
          newScenario.start_id = scenario.end_id;
          newScenario.end_id = waypointId;
          scenario.start_id = waypointId;
          break;
        }
      }
      // insert last
      newScenario = { ...scenarios[scenarios.length - 1] };
      newScenario.start_id = newScenario.end_id;
      newScenario.end_id = waypointId;
    }
    if (newScenario.hasOwnProperty("start_id") && newScenario.hasOwnProperty("end_id")) {
      const sortedScenarios = [...scenarios, newScenario].slice().sort((a, b) => (a.start_id > b.start_id) ? 1 : (b.start_id > a.start_id) ? -1 : 0);
      setScenarios(sortedScenarios);
    }
  }

  useEffect(() => {
    // add new scenario
    if (clickedWaypointId) addNewScenario(clickedWaypointId);
  }, [clickedWaypointId])

  return (
    scenarios.length > 0 ?
      <List style={{ overflow: 'scroll' }}>
        {scenarios.map((scenario, index) => <Scenario key={index} scenario={scenario} />)}
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