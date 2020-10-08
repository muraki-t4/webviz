import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
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

import DeleteIcon from '@material-ui/icons/Delete';
import Checkbox from '@material-ui/core/Checkbox';


function Scenario({ scenario, id_score }) {

  const [open, setOpen] = useState(false);

  return (
    <div>
      <ListItem button onClick={() => setOpen(prevOpen => !prevOpen)} >
        <ListItemText primary={`${scenario.start_id} - ${scenario.end_id}`} />
        <DeleteIcon onClick={(e) => { alert(1); e.preventDefault(); }} />
      </ListItem>
      <ScenarioDialog
        scenario={scenario}
        id_score={id_score}
        open={open}
        handleClose={() => setOpen(false)}
      />
    </div>
  )
}

function ScenarioDialog({ scenario, id_score, open, handleClose }) {

  const handleClickCheckbox = (key, value) => () => {
    console.log(key, value);
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      scroll={'paper'}
    >
      <DialogTitle>シナリオ修正</DialogTitle>
      <DialogContent dividers={true}>
        <List dense={true} style={{ fontSize: 16 }}>
          {Object.entries(scenario).map(([key, value]) =>
            <ScenarioItem
              key={key}
              id_score={id_score}
              item={{ key, value }}
              handleClickCheckbox={handleClickCheckbox}
            />
          )}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          更新
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function ScenarioItem({ item, id_score, handleClickCheckbox }) {

  const label = [
    ...id_score,
    { "contents": "start_id", "message": "シナリオ始点" },
    { "contents": "end_id", "message": "シナリオ終点" },
    { "contents": "speed_limit", "message": "上限速度" },
  ].filter(elem => elem.contents === item.key)[0].message || "該当なし";

  return (
    ["start_id", "end_id", "speed_limit"].includes(item.key) ?
      <ListItem>
        <ListItemText primary={label} />
        <TextField
          type="number"
          value={item.value}
          style={{ paddingLeft: 10 }}
        />
      </ListItem>
      :
      <ListItem button onClick={handleClickCheckbox(item.key, item.value)}>
        <ListItemText primary={label} />
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