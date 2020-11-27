import React, { useEffect, useRef } from "react";
import Timeline from '@material-ui/lab/Timeline';
import CSVReader from 'react-csv-reader';
import Typography from '@material-ui/core/Typography';
import Scenario from "./Scenario";

function ScenarioHandler({ scenarios, setScenarios, setCheckpoints, id_score, clickedWaypointId }) {

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

  const updateScenarios = (index, scenario) => {
    let prevScenarios = scenarios.slice();
    if (scenario === null) {
      const deletedCheckpointId = scenarios[index].end_id;
      // delete checkpoint
      setCheckpoints(prevCheckpoints => prevCheckpoints.filter((checkpoint) => checkpoint.id !== deletedCheckpointId));
      // delete scenario and reorder
      prevScenarios[index + 1].start_id = prevScenarios[index].start_id;
      prevScenarios = prevScenarios.filter((_, i) => i !== index);
    } else {
      // update scenario
      prevScenarios[index] = scenario;
    }
    setScenarios(prevScenarios);
  }

  useEffect(() => {
    const _defaultScenario = { start_id: null, end_id: null, speed_limit: 30 }
    for (const elem of id_score) {
      _defaultScenario[elem.contents] = 0;
    }
    defaultScenario.current = _defaultScenario;
  }, [id_score])

  useEffect(() => {
    // add new scenario
    if (clickedWaypointId && id_score.length > 0) addNewScenario(clickedWaypointId);
  }, [clickedWaypointId])

  return (
    scenarios.length > 0 ?
      <Timeline align="left" style={{ alignItems: "flex-start" }}>
        {scenarios.map((scenario, index) =>
          <Scenario
            key={index}
            index={index}
            scenario={scenario}
            id_score={id_score}
            updateScenarios={updateScenarios}
          />
        )}
      </Timeline>
      :
      <div>
        <Typography variant="subtitle1">scenario.csv</Typography>
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