import Unity, { UnityContent } from "react-unity-webgl";
import React, { useState, useEffect } from "react";
import MUIRichTextEditor from "mui-rte";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import useKeyPress from "./Keypress";
import { Octokit } from "@octokit/rest";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

let unityContent = new UnityContent("Build/Build.json", "Build/UnityLoader.js");

var panelContents = {};

var octokit = new Octokit();

fetch(
  "https://raw.githubusercontent.com/BallardHSCS/VirtualLibrary-AdminInterface/main/config/config.json"
)
  .then((response) => response.json())
  .then((data) => {
    panelContents = data;
    console.log(data);
  });

function App() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  var [currentPanel, setCurrentPanel] = React.useState("");

  const spacePress = useKeyPress("Space");

  unityContent.on("ToggleInfopanel", (panelName) => {
    setCurrentPanel(panelName);
    setOpen(true);
  });

  function handleInfoPanelClose() {
    setCurrentPanel("");
    setOpen(false);
  }

  return (
    <div>
      <div className="instructions">
        <p styles={{ textAlign: "left" }}>
          <span className="instruction-item">
            Use the W, A, S and D keys to move.
          </span>
          <span className="instruction-item">Hold shift to move faster!</span>
          <span className="instruction-item">
            Press ESC twice to pause the game and click links.
          </span>
        </p>
      </div>
      <div id="unityContainer" className="App">
        <Unity unityContent={unityContent} />
      </div>
      <div className="page-content">
        <h2 id="transition-modal-title">
          {
            {
              "Makerspace-Info": "Makerspace",
              "Printing-Info": "Printing Station",
              "Bookshelf-Info": "Bookshelves",
              "Games-Info": "Board Games",
              "Film-Info": "BHS Digital Filmmaking",
            }[currentPanel]
          }
        </h2>
        <p className="content">
          <MUIRichTextEditor
            defaultValue={panelContents[currentPanel]}
            readOnly={true}
            inheritFontSize={true}
            toolbar={false}
          />
        </p>
      </div>
    </div>
  );
}

export default App;
