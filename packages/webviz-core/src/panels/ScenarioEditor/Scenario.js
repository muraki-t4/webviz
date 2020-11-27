import React, { useState } from "react";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';


function Scenario({ index, scenario, id_score, updateScenarios }) {

  const [open, setOpen] = useState(false);

  return (
    <div>
      <ListItem button onClick={() => setOpen(prevOpen => !prevOpen)} >
        <ListItemText primary={`${scenario.start_id} - ${scenario.end_id}`} />
      </ListItem>
      <ScenarioDialog
        index={index}
        scenario={scenario}
        id_score={id_score}
        open={open}
        updateScenarios={updateScenarios}
        handleClose={() => setOpen(false)}
      />
    </div>
  )
}

function ScenarioDialog({ index, scenario, id_score, open, handleClose, updateScenarios }) {

  const handleItemValueChaned = (key, value) => {
    updateScenarios(index, { ...scenario, [key]: value })
  }

  const deleteScenario = () => {
    updateScenarios(index, null);
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      scroll={'paper'}
      fullWidth={true}
      maxWidth={'sm'}
    >
      <DialogTitle>シナリオ修正</DialogTitle>
      <DialogContent dividers={true}>
        <List dense={true}>
          {Object.keys(scenario).map(key =>
            <ScenarioItem
              key={key}
              id_score={id_score}
              item={{ key: key, value: scenario[key] }}
              handleItemValueChaned={handleItemValueChaned}
            />
          )}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={deleteScenario} color="primary">
          削除
        </Button>
        <Button onClick={handleClose} color="primary">
          更新
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function ScenarioItem({ item, id_score, handleItemValueChaned }) {

  const label = [
    ...id_score,
    { "contents": "start_id", "message": "シナリオ始点" },
    { "contents": "end_id", "message": "シナリオ終点" },
    { "contents": "speed_limit", "message": "上限速度" },
  ].filter(elem => elem.contents === item.key)[0].content_labels || "該当なし";

  return (
    ["start_id", "end_id", "speed_limit"].includes(item.key) ?
      <ListItem>
        <ListItemText primary={label} style={{ fontSize: 40 }} />
        <TextField
          type="number"
          value={item.value}
          style={{ paddingLeft: 20 }}
          onChange={e => handleItemValueChaned(item.key, parseInt(e.target.value))}
        />
      </ListItem>
      :
      <ListItem button onClick={() => handleItemValueChaned(item.key, (item.value === 1) ? 0 : 1)}>
        <ListItemText primary={label} style={{ fontSize: 40 }} />
        <ListItemSecondaryAction>
          <Checkbox
            edge="end"
            checked={item.value === 1}
            tabIndex={-1}
            disableRipple
          />
        </ListItemSecondaryAction>
      </ListItem>
  )
}

export default Scenario;