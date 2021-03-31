class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "hello",
      countup: 0,
      countdown: 25 * 60 * 1000,
      sessionLength: 25,
      breakLength: 5,
      timerType: "Session",
      timerStatus: "Stopped",
      timeStamp: null };

    this.startStopTimer = this.startStopTimer.bind(this);
    this.runTimer = this.runTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    this.clearTimer = this.clearTimer.bind(this);
    this.adjustTimer = this.adjustTimer.bind(this);
    this.playAlert = this.playAlert.bind(this);
    this.time = null;
    this.sound = null;
  }

  adjustTimer(e) {
    const sessionMax = 60;
    const sessionMin = 1;
    const breakMax = 60;
    const breakMin = 1;

    const { sessionLength, breakLength, timerStatus } = this.state;
    if (timerStatus == "Stopped") {
      switch (e.target.value) {
        case "session_inc":
          if (sessionLength < sessionMax) {
            this.setState({
              sessionLength: sessionLength + 1,
              countdown: (sessionLength + 1) * 60 * 1000 });

          }
          break;
        case "session_dec":
          if (sessionLength > sessionMin) {
            this.setState({
              sessionLength: sessionLength - 1,
              countdown: (sessionLength - 1) * 60 * 1000 });

          }
          break;
        case "break_inc":
          if (breakLength < breakMax) {
            this.setState({
              breakLength: breakLength + 1 });

          }
          break;
        case "break_dec":
          if (breakLength > breakMin) {
            this.setState({
              breakLength: breakLength - 1 });

          }
        default:
          break;}

    }
  }

  startStopTimer() {
    const { timerStatus, timerType } = this.state;
    let timerLength;
    if (timerStatus == "Stopped") {//To ensure timer can resume time correctly
      const { countdown, sessionLength, breakLength } = this.state;
      if (timerType == "Session") {
        timerLength = sessionLength * 60 * 1000;
      } else if (timerType == "Break") {
        timerLength = breakLength * 60 * 1000;
      }
      console.log(timerLength);
      let now = Date.now();
      let timeStamp;
      countdown == timerLength ?
      timeStamp = now + timerLength :
      timeStamp = now + countdown;
      this.setState({
        timeStamp: timeStamp,
        timerStatus: "Running" });

      this.time = setInterval(this.runTimer, 1000);
    } else
    if (timerStatus == "Running") {
      this.stopTimer();
    }
  }
  /*else if (Math.round(timeleft / 1000) == 0){  //get new timestamp when timer hit zero
        if (timerType == "Session"){    
          newTimeStamp = Date.now() + breakLength*60*1000;
        } else if (timerType == "Break"){
          newTimeStamp = Date.now() + sessionLength*60*1000;
        }
    }*/
  runTimer() {
    const { countup, timeStamp, timerType, sessionLength, breakLength } = this.state;
    let timeleft = timeStamp - Date.now();
    if (Math.round(timeleft / 1000) >= 0) {//run clock, if there is still time left
      this.setState({
        countdown: timeleft });

    } else if (Math.round(timeleft / 1000) < 0) {
      //when time is up, swtich to another clock at -0.1sec
      if (timerType == "Session") {
        this.setState({
          timerType: "Break",
          //use these for more accurate time
          //timeStamp: Date.now() + breakLength*60*1000 - 1000,
          //countdown: breakLength*60*1000 - 1000,
          timeStamp: Date.now() + breakLength * 60 * 1000,
          countdown: breakLength * 60 * 1000 });

      } else if (timerType == "Break") {
        this.setState({
          timerType: "Session",
          //use these for more accruate time
          //timeStamp: Date.now() + sessionLength*60*1000 - 1000,
          //countdown: sessionLength*60*1000 - 1000,
          timeStamp: Date.now() + sessionLength * 60 * 1000,
          countdown: sessionLength * 60 * 1000 });

      }
    }
  }

  stopTimer() {
    clearInterval(this.time);
    let aud = document.getElementById("beep");
    aud.pause();
    aud.currentTime = 0;
    this.setState({
      message: "- Timer Stopped -",
      timerStatus: "Stopped" });

  }

  clearTimer() {
    clearInterval(this.time);
    let aud = document.getElementById("beep");
    aud.pause();
    aud.currentTime = 0;
    this.setState({
      message: "hello",
      countup: 0,
      countdown: 25 * 60 * 1000,
      sessionLength: 25,
      breakLength: 5,
      timerType: "Session",
      timerStatus: "Stopped",
      timeStamp: null });

  }
  playAlert(key) {
    this.sound = document.getElementById(key);
    this.sound.currentTime = 0;
    this.sound.volume = 0.2;
    this.sound.play();
  }
  render() {

    return /*#__PURE__*/(
      React.createElement("div", { className: "appWrapper" }, /*#__PURE__*/
      React.createElement("h1", { className: "text-center" }, "25 + 5 Clock"), /*#__PURE__*/
      React.createElement(Adjuster, { break: this.state.breakLength,
        session: this.state.sessionLength,
        method: this.adjustTimer }), /*#__PURE__*/
      React.createElement(Time, { timerType: this.state.timerType,
        time: this.state.countdown,
        alert: this.playAlert }), /*#__PURE__*/
      React.createElement("div", { id: "timer-control" }, /*#__PURE__*/
      React.createElement("button", { id: "start_stop", onClick: this.startStopTimer }, /*#__PURE__*/React.createElement("i", { class: "fas fa-play" }), /*#__PURE__*/React.createElement("i", { class: "fas fa-pause" })), /*#__PURE__*/
      React.createElement("button", { id: "reset", onClick: this.clearTimer }, /*#__PURE__*/React.createElement("i", { class: "fas fa-undo-alt" })))));



  }}


class Time extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    let timeInSeconds = Math.round(this.props.time / 1000);
    let minutes = Math.floor(timeInSeconds / 60);
    let seconds = Math.floor(timeInSeconds - minutes * 60);
    if (minutes < 10) {minutes = "0" + minutes;}
    if (seconds < 10) {seconds = "0" + seconds;}
    if (timeInSeconds <= 0) {
      this.props.alert("beep");
    }
    return /*#__PURE__*/(
      React.createElement("div", { id: "timerWrapper" }, /*#__PURE__*/
      React.createElement("h2", { className: "text-center", id: "timer-label" }, this.props.timerType), /*#__PURE__*/
      React.createElement("audio", { id: "beep", src: "https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav" }), /*#__PURE__*/
      React.createElement("p", { className: "text-center", id: "time-left" }, minutes, ":", seconds)));


  }}


class Adjuster extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return /*#__PURE__*/(
      React.createElement("div", { id: "adjusterWrapper" }, /*#__PURE__*/
      React.createElement("div", { className: "adjuster text-center", id: "break-adjuster" }, /*#__PURE__*/
      React.createElement("h3", { id: "break-label" }, "Break"), /*#__PURE__*/
      React.createElement("div", { className: "row" }, /*#__PURE__*/
      React.createElement("div", { className: "col-xs-3" }, /*#__PURE__*/
      React.createElement("button", { id: "break-decrement", value: "break_dec", onClick: this.props.method }, /*#__PURE__*/React.createElement("i", { class: "far fa-caret-square-down" }))), /*#__PURE__*/

      React.createElement("div", { className: "col-xs-6" }, /*#__PURE__*/
      React.createElement("p", { id: "break-length" }, this.props.break)), /*#__PURE__*/

      React.createElement("div", { className: "col-xs-3" }, /*#__PURE__*/
      React.createElement("button", { id: "break-increment", value: "break_inc", onClick: this.props.method }, /*#__PURE__*/React.createElement("i", { class: "far fa-caret-square-up" }))))), /*#__PURE__*/



      React.createElement("div", { className: "adjuster text-center", id: "session-adjuster" }, /*#__PURE__*/
      React.createElement("h3", { id: "session-label" }, "Session"), /*#__PURE__*/
      React.createElement("div", { className: "col-xs-3" }, /*#__PURE__*/
      React.createElement("button", { id: "session-decrement", value: "session_dec", onClick: this.props.method }, /*#__PURE__*/React.createElement("i", { class: "far fa-caret-square-down" }))), /*#__PURE__*/

      React.createElement("div", { className: "col-xs-6" }, /*#__PURE__*/
      React.createElement("p", { id: "session-length" }, this.props.session)), /*#__PURE__*/

      React.createElement("div", { className: "col-xs-3" }, /*#__PURE__*/
      React.createElement("button", { id: "session-increment", value: "session_inc", onClick: this.props.method }, /*#__PURE__*/React.createElement("i", { className: "far fa-caret-square-up" }))))));




  }}


ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById("app"));