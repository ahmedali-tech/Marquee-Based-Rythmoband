import "../../../node_modules/video-react/dist/video-react.css";
import React, { Component, useState, useEffect, useRef } from "react";

import { Player, ControlBar } from "video-react";
import { Button } from "@mui/material";
import getSub_Millis from "../../services/srtreader";
import getSub_Seconds from "../../services/srtreader";
import Smarquee from "smarquee";
import { TextField } from "@mui/material";
import NewSRTDownload from "../../services/srtHandler";

export default function Rythmoband(props) {
  const initialPosition = useRef(
    props.rythmoPosition === undefined
      ? `${window.innerWidth * 0.3}px`
      : props.rythmoPosition
  );

  const [number, setnumber] = useState(
    props.dialogueNumber === undefined ? 0 : props.dialogueNumber
  );
  const [timerCheck, setTimerCheck] = useState(true);
  const [moverNumber, setMoverNumber] = useState(40);
  const [currentTime, setCurrentTime] = useState(0);

  const textMover = () => {
    let x = parseFloat(initialPosition.current);
    let start = getSub_Millis(props.time[number][0]);
    let end = getSub_Millis(props.time[number][1]);
    console.log(initialPosition.current);

    let timeToMove = end - start;
    setMoverNumber((window.innerWidth * 0.25) / timeToMove);

    setCurrentTime(props.time.currentTime);
    x = x + moverNumber;
    let y = `${x}px`;
    initialPosition.current = y;
  };
  setTimeout(() => {
    textMover();
    timercheck();
    backChecker();
  }, 0.00000001);
  const timercheck = () => {
    if (
      getSub_Millis(props.time[number][1]) - props.player.currentTime * 1000 <
      1
    ) {
      initialPosition.current = `${window.innerWidth * 0.3}px`;
      setnumber(number + 1);
    }
  };
  const backChecker = () => {
    for (let index = 0; index < props.time.length; index++) {
      if (
        getSub_Millis(props.time[index][1]) > props.player.currentTime * 1000 &&
        getSub_Millis(props.time[index][0]) < props.player.currentTime * 1000
      ) {
        setnumber(index);
      }
    }
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <TextField
          style={{ marginTop: "20px" }}
          label="Edit your dialogue"
          id="outlined-start-adornment"
          defaultValue="edit your values here"
          onChange={(e) => {
            props.dialogue[number] = e.target.value;
            console.log(e.target.value);
          }}
        />
        <Button
          onClick={() => {
            console.log(props.time[0]);
            NewSRTDownload(props.dialogue, props.time);
          }}
          variant="contained"
          component="label"
          color="primary"
          style={{ marginLeft: "10px", height: "30px", marginTop: "30px" }}
        >
          save SRT
        </Button>
      </div>
      <div
        style={{
          width: window.innerWidth,
          background: "#FF8232",
          marginTop: "20px",
          height: "75px",
          position: "relative",
          border: "5px solid black",
        }}
      >
        <div
          style={{
            width: "5px",
            background: "red",
            marginTop: "20px",
            height: "75px",
            position: "absolute",
            top: "-25%",
            left: "25%",
          }}
        ></div>

        <strong
          style={{
            position: "absolute",
            left: "0%",
            top: "25%",
            fontSize: "2rem",
            "white-space": "nowrap",
            overflow: "hidden",
            "text-overflow": "ellipsis",
          }}
        >
          <marquee
            id="marqueerythm"
            loop="0"
            scrollamount={
              window.innerWidth *
              0.1 *
              (1 /
                (getSub_Seconds(props.time[number][1]) -
                  getSub_Seconds(props.time[number][0]))) *
              props.player.playbackRate
            }
            style={{
              direction: "left",
              width: window.innerWidth,
              behavior: "scroll",
            }}
          >
            {props.dialogue[number]}
          </marquee>
        </strong>
      </div>
      <pre id="output"></pre>
      <div id="container1"></div>
    </>
  );
}
