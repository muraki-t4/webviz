import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';
import Checkbox from '@material-ui/core/Checkbox';

const useStyles = makeStyles((theme) => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

function Scenario({ scenario }) {

  const [open, setOpen] = useState(false);

  const handleClickCheckbox = (key, value) => () => {
    console.log(key, value);
  }

  return (
    <div>
      <ListItem button onClick={() => setOpen(prevOpen => !prevOpen)} >
        <ListItemText primary={`${scenario.start_id} - ${scenario.end_id}`} />
        <DeleteIcon onClick={(e) => { alert(1); e.preventDefault(); }} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List dense={true} disablePadding>
          {Object.entries(scenario).map(([key, value]) => <ScenarioItem key={key} item={{ key, value }} handleClickCheckbox={handleClickCheckbox} />)}
        </List>
      </Collapse>
    </div>
  )
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