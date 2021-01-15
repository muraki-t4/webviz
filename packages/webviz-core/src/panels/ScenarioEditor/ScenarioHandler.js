import React, { useEffect, useRef } from "react";
import Timeline from '@material-ui/lab/Timeline';
import CSVReader from 'react-csv-reader';
import Typography from '@material-ui/core/Typography';
import Scenario from "./Scenario";

function ScenarioHandler({ scenarios, setScenarios, checkpoints, setCheckpoints, id_score }) {

  const defaultScenario = useRef({});

  const reconstructorScenarios = (newCheckpoints) => {
    if (2 > newCheckpoints.length) return;
    const newScenarios = newCheckpoints.slice(0, -1).map((checkpoint, index) => ({
      ...(scenarios.find(scenario => scenario.start_id === checkpoint.id) || defaultScenario.current),
      start_id: checkpoint.id,
      end_id: newCheckpoints[index + 1].id,
    }));
    setScenarios(newScenarios);
  }

  const updateScenarios = (index, scenario, backward = true) => {
    let newScenarios = scenarios.slice();
    if (scenario === null) {
      const deleteCheckpointId = (backward) ? newScenarios[index].end_id : newScenarios[index].start_id;
      const newCheckpoints = checkpoints.filter(checkpoint => checkpoint.id !== deleteCheckpointId);
      setCheckpoints(newCheckpoints);
    } else {
      newScenarios[index] = scenario;
      setScenarios(newScenarios);
    }
  }

  useEffect(() => {
    const _defaultScenario = { start_id: null, end_id: null, speed_limit: 30 }
    for (const elem of id_score) {
      _defaultScenario[elem.contents] = 0;
    }
    defaultScenario.current = _defaultScenario;
  }, [id_score])

  useEffect(() => {
    reconstructorScenarios(checkpoints);
  }, [checkpoints]);

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
        <Typography variant="h6">scenario.csv</Typography>
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