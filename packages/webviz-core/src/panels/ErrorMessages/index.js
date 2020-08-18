// @flow
//
//  Copyright (c) 2019-present, Cruise LLC
//
//  This source code is licensed under the Apache License, Version 2.0,
//  found in the LICENSE file in the root directory of this source tree.
//  You may not use this file except in compliance with the License.

import _ from "lodash";
import React, { useCallback, useState } from "react";
import { hot } from "react-hot-loader/root";
import styled from "styled-components";

import helpContent from "./index.help.md";
import Flex from "webviz-core/src/components/Flex";
import Panel from "webviz-core/src/components/Panel";
import PanelToolbar from "webviz-core/src/components/PanelToolbar";
import LogList from "webviz-core/src/components/LogList";
import type { RenderRow } from "webviz-core/src/components/LogList";
import type { SaveConfig } from "webviz-core/src/types/panels";

type Config = { noteText: string };
type Props = { config: Config, saveConfig: SaveConfig<Config> };

function ErrorMessages({ config, saveConfig }: Props) {

  const [items, setItems] = useState([
    { id: 1, text: "こんにちは" },
    { id: 2, text: "漢字" },
    { id: 3, text: "hello" },
    { id: 4, text: "全角　スペース" },
  ]);

  return (
    <Flex col style={{ height: "100%" }}>
      <PanelToolbar helpContent={helpContent} floating />
      <LogList
        items={items}
        renderRow={({ item, style }) => (
          <div
            style={{
              ...style,
              display: "flex",
              flexDirection: "column",
              padding: 8,
              borderBottom: "1px solid gray",
            }}
            key={item.id}
          >
            <p>
              <span style={{ color: "orange", marginRight: 8 }}>{item.id}</span>
              <span>{item.text}</span>
            </p>
          </div>
        )}
      />
    </Flex>
  );

}

ErrorMessages.panelType = "ErrorMessages";
ErrorMessages.defaultConfig = { noteText: "" };

export default hot(Panel<Config>(ErrorMessages));
