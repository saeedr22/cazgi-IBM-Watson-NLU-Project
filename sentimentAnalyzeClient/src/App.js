import './bootstrap.min.css';
import './App.css';
import EmotionTable from './EmotionTable.js';
import React from 'react';

class App extends React.Component {
  state = {
    innercomp: <textarea rows="4" cols="50" id="textinput" />,
    mode: "text",
    sentimentOutput: [],
    sentiment: true
  }

  renderTextArea = () => {
    document.getElementById("textinput").value = "";
    if (this.state.mode === "url") {
      this.setState({
        innercomp: <textarea rows="4" cols="50" id="textinput" />,
        mode: "text",
        sentimentOutput: [],
        sentiment: true
      })
    }
  }

  renderTextBox = () => {
    document.getElementById("textinput").value = "";
    if (this.state.mode === "text") {
      this.setState({
        innercomp: <textarea rows="1" cols="50" id="textinput" />,
        mode: "url",
        sentimentOutput: [],
        sentiment: true
      })
    }
  }

  sendForSentimentAnalysis = () => {
    this.setState({ sentiment: true });
    let url = "";

    if (this.state.mode === "url") {
      url = url + "/url/sentiment?url=" + document.getElementById("textinput").value;
    } else {
      url = url + "/text/sentiment?text=" + document.getElementById("textinput").value;
    }
    fetch(url).then((response) => {
      response.text().then((data) => {
        data = JSON.parse(data)
        let output = null;
        if (data.error) {
          output = data.error
        } else {
          if (data.label === "positive") {
            output = <div style={{ color: "green", fontSize: 20 }}>{data.score}</div>
          } else if (data.label === "negative") {
            output = <div style={{ color: "red", fontSize: 20 }}>{data.score}</div>
          } else {
            output = <div style={{ color: "orange", fontSize: 20 }}>{data.score}</div>
          }
        }
        this.setState({ sentimentOutput: <p>{output} </p> });

      })
    }).catch((err) => this.setState({ sentimentOutput: <p>Error while sending Request !</p> }));
  }

  sendForEmotionAnalysis = () => {

    this.setState({ sentiment: false });
    let url = ".";
    if (this.state.mode === "url") {
      url = url + "/url/emotion?url=" + document.getElementById("textinput").value;
    } else {
      url = url + "/text/emotion/?text=" + document.getElementById("textinput").value;
    }
    fetch(url).then((response) => {
      response.json().then((data) => {
        if (data.error) {
          this.setState({ sentimentOutput: <p> {data.error} </p> });
        }
        else
          this.setState({ sentimentOutput: <EmotionTable emotions={data} /> });
      })
    }).catch((err) => this.setState({ sentimentOutput: <p>Error while sending Request !</p> }));
  }


  render() {
    return (
      <div className="App">
        <button className="btn btn-info" onClick={this.renderTextArea}>Text</button>
        <button className="btn btn-dark" onClick={this.renderTextBox}>URL</button>
        <br /><br />
        {this.state.innercomp}
        <br />
        <button className="btn-primary" onClick={this.sendForSentimentAnalysis}>Analyze Sentiment</button>
        <button className="btn-primary" onClick={this.sendForEmotionAnalysis}>Analyze Emotion</button>
        <br />
        {this.state.sentimentOutput}
      </div>
    );
  }
}

export default App;
