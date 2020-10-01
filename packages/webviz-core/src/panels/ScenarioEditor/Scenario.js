import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles((theme) => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

function Scenario({ scenario }) {

  const [open, setOpen] = useState(false);

  return (
    <div className="drag-handle">
      <ListItem button onClick={() => setOpen(prevOpen => !prevOpen)} >
        <ListItemText primary={`${scenario.start_id} - ${scenario.end_id}`} />
        <DeleteIcon onClick={(e) => { alert(1); e.preventDefault(); }} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          { [1,2,3].map(e=><ScenarioItem item={e} />) }
        </List>
      </Collapse>
    </div>
  )
}

function ScenarioItem({ item }) {

  const classes = useStyles();

  return (
    <ListItem button className={classes.nested}>
      <ListItemText primary="Starred" />
    </ListItem>
  )
}

export default Scenario;