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
import MuiTimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import { makeStyles, withStyles } from "@material-ui/core/styles";

const TimelineItem = withStyles({
  missingOppositeContent: {
    "&:before": {
      display: "none"
    }
  }
})(MuiTimelineItem);

const useStyles = makeStyles((theme) => ({
  listItemText: {
    fontSize: '1.0em',
  },
}));

function Scenario({ index, scenario, id_score, updateScenarios }) {

  const [open, setOpen] = useState(false);

  return (
    <>
      <TimelineItem button onClick={() => setOpen(prevOpen => !prevOpen)}>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>{`${scenario.start_id} - ${scenario.end_id}`}</TimelineContent>
      </TimelineItem>
      <ScenarioDialog
        index={index}
        scenario={scenario}
        id_score={id_score}
        open={open}
        updateScenarios={updateScenarios}
        handleClose={() => setOpen(false)}
      />
    </>
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

  const classes = useStyles();

  const label = [
    ...id_score,
    { "contents": "start_id", "content_labels": "シナリオ始点" },
    { "contents": "end_id", "content_labels": "シナリオ終点" },
    { "contents": "speed_limit", "content_labels": "上限速度" },
  ].find(elem => elem.contents === item.key).content_labels || "該当なし";

  return (
    ["start_id", "end_id", "speed_limit"].includes(item.key) ?
      <ListItem>
        <ListItemText primary={label} classes={{ primary: classes.listItemText }} />
        <TextField
          type="number"
          value={item.value}
          style={{ paddingLeft: 20 }}
          onChange={e => handleItemValueChaned(item.key, parseInt(e.target.value))}
        />
      </ListItem>
      :
      <ListItem button onClick={() => handleItemValueChaned(item.key, (item.value === 1) ? 0 : 1)}>
        <ListItemText primary={label} classes={{ primary: classes.listItemText }} />
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