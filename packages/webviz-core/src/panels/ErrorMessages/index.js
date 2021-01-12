// @flow
//
//  Copyright (c) 2019-present, Cruise LLC
//
//  This source code is licensed under the Apache License, Version 2.0,
//  found in the LICENSE file in the root directory of this source tree.
//  You may not use this file except in compliance with the License.

import _ from "lodash";
import React, { useState, useEffect } from "react";
import { hot } from "react-hot-loader/root";
import ROSLIB from 'roslib';

import helpContent from "./index.help.md";
import Flex from "webviz-core/src/components/Flex";
import Panel from "webviz-core/src/components/Panel";
import PanelToolbar from "webviz-core/src/components/PanelToolbar";
import LogList from "webviz-core/src/components/LogList";

type Config = { errorMessages: Object };
type Props = { config: Config };

const toSec = ({ secs, nsecs }) => {
  return secs + nsecs * 1e-9;
}

const toSecFromNS = (ns) => {
  return parseInt(ns) * 1e-9;
}

function ErrorMessages({ config }: Props) {

  const [errorLogs, setErrorLogs] = useState([]);
  const [error, setError] = useState(null);
  const [startTime, setStartTime] = useState(0);

  const params = new URLSearchParams(window.location.search);
  const rosbridgeWebsocketUrl = params.get("rosbridge-websocket-url");
  const errorLogUrl = params.get("error-log-url");
  const offset = params.get("offset") || 3;
  const duration = params.get("duration") || 6;

  const ros = new ROSLIB.Ros({ url: rosbridgeWebsocketUrl });

  const playService = new ROSLIB.Service({
    ros: ros,
    name: '/rosbag_player_controller/play',
    serviceType: 'std_srv/Trigger',
  })

  const seekService = new ROSLIB.Service({
    ros: ros,
    name: '/rosbag_player_controller/seek_and_play',
    serviceType: 'controllable_rosbag_player/Seek',
  });

  const pauseService = new ROSLIB.Service({
    ros: ros,
    name: '/rosbag_player_controller/pause',
    serviceType: 'std_srv/Trigger',
  });

  const callSeekService = ({ timestamp, error_id }) => {
    try {
      const ts = toSecFromNS(timestamp) - startTime - offset;
      seekService.callService(
        new ROSLIB.ServiceRequest({ time: ts, }),
        result => console.log(result)
      );
      setTimeout(() => {
        pauseService.callService(
          new ROSLIB.ServiceRequest({}),
          result => console.log(result)
        );
        // post message to parent window
        if (window.parent) window.parent.postMessage(error_id, "*");
      }, duration * 1000);
    } catch (error) {
      console.error(error);
    }
  }

  const getErrorLog = () => {
    try {
      fetch(errorLogUrl)
        .then(res => res.json())
        .then(json => setErrorLogs(json))
        .catch(error => setError(error));
    } catch (error) {
      setError(error);
    }
  }

  const sortByTimestamp = (a, b) => {
    return (parseInt(a.timestamp) > parseInt(b.timestamp)) ? 1 : ((parseInt(b.timestamp) > parseInt(a.timestamp)) ? -1 : 0);
  }

  useEffect(() => {
    getErrorLog();
    const playerEventListener = new ROSLIB.Topic({
      ros: ros,
      name: '/rosbag_player_controller/rosbag_start_time',
      messageType: 'rosgraph_msgs/Clock',
    });
    playerEventListener.subscribe(({ clock }) => {
      setStartTime(toSec(clock));
      playService.callService(
        new roslib.ServiceRequest({}),
        result => console.log(result)
      )
    });
    return () => playerEventListener.unsubscribe();
  }, []);

  return (
    <Flex col style={{ height: "100%" }}>
      <PanelToolbar helpContent={helpContent} floating />
      <div style={{ padding: 10, fontSize: 16 }}>
        <span>検定結果一覧</span>
      </div>
      <LogList
        style={{ overflow: 'scroll', paddingBottom: 20 }}
        items={errorLogs.sort(sortByTimestamp)}
        renderRow={({ item, style }) => (
          <div
            style={{
              ...style,
              display: "flex",
              flexDirection: "column",
              padding: 10,
              fontSize: 14,
            }}
            key={item.error_id}
            onClick={() => callSeekService(item)}
          >
            <p>
              <span style={{ color: "orange", marginRight: 8 }}>{item.scenario_start_id}</span>
              <span>{item.error_message}</span>
            </p>
          </div>
        )}
      />
      {error &&
        <div style={{ padding: 10, fontSize: 14 }}>
          <p style={{ color: "orange" }}>エラーメッセージ一覧が取得できませんでした</p>
        </div>
      }
    </Flex>
  );

}

ErrorMessages.panelType = "ErrorMessages";
ErrorMessages.defaultConfig = { errorMessages: {} };

export default hot(Panel<Config>(ErrorMessages));
