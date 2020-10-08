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

import DeleteIcon from '@material-ui/icons/Delete';
import Checkbox from '@material-ui/core/Checkbox';

const useStyles = makeStyles((theme) => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

function Scenario({ scenario }) {

  const [open, setOpen] = useState(false);

  return (
    <div>
      <ListItem button onClick={() => setOpen(prevOpen => !prevOpen)} >
        <ListItemText primary={`${scenario.start_id} - ${scenario.end_id}`} />
        <DeleteIcon onClick={(e) => { alert(1); e.preventDefault(); }} />
      </ListItem>
      <ScenarioDialog scenario={scenario} open={open} handleClose={() => setOpen(false)} />
    </div>
  )
}

function ScenarioDialog({ scenario, open, handleClose }) {

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
        <List dense={true}>
          {Object.entries(scenario).map(([key, value]) => <ScenarioItem key={key} item={{ key, value }} handleClickCheckbox={handleClickCheckbox} />)}
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

function ScenarioItem({ item, handleClickCheckbox }) {

  const classes = useStyles();

  return (
    ["start_id", "end_id", "speed_limit"].includes(item.key) ?
      <ListItem button className={classes.nested}>
        <ListItemText primary={item.key} />
      </ListItem>
      :
      <ListItem button className={classes.nested} onClick={handleClickCheckbox(item.key, item.value)}>
        <ListItemText primary={item.key} />
        <ListItemSecondaryAction>
          <Checkbox
            edge="end"
            checked={item.value}
            tabIndex={-1}
            disableRipple
          />
        </ListItemSecondaryAction>
      </ListItem>
  )
}

export default Scenario;