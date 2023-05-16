let dataV = []; //Array to hold voltage data
let dataC = []; //Array to hold current data

let rawVData;
let rawCData;
let systemInfo;
let serverBattery;

let maxC;
let maxV;

function preload() {
  rawVData = loadJSON(
    "https://server.solarpowerforartists.com/api/v2/opendata.php?value=PV-voltage&duration=7"
  );
  rawCData = loadJSON(
    "https://server.solarpowerforartists.com/api/v2/opendata.php?value=PV-current&duration=7"
  );
  systemInfo = loadJSON(
    "https://server.solarpowerforartists.com/api/v2/opendata.php?systemInfo=dump"
  );
  serverBattery = loadJSON(
    "https://server.solarpowerforartists.com/api/v2/opendata.php?value=battery-percentage"
  );
}

function setup() {
  var canvas = createCanvas(960, 960);
  canvas.parent("sketch");
  //background(0);
  background("#fcf951");
  angleMode(DEGREES);
  //strokeWeight(0.25);
  //noFill();
  //frameRate(120);

  processVData(rawVData);
  processCData(rawCData);

  textFont("IBM Plex Mono");
  textSize(16);
  textAlign(CENTER, CENTER);
  text(systemInfo.dump.name, width / 2, height / 2);
  text(
    systemInfo.dump.location + "," + systemInfo.dump.country,
    width / 2,
    height / 2 + 24
  );
  text(
    "Battery:" + parseFloat(serverBattery["battery-percentage"]) * 100 + "%",
    width / 2,
    height / 2 + 50
  );

  textAlign(LEFT);
  text(rawCData.header.datetime, 30, height - 30);
  text(rawVData.header.datetime, 162, height - 30);

  fill("#D4295E");
  noStroke();
  rectMode(CENTER);
  rect(18, height - 32, 10, 10);

  fill("#0063B2");
  rect(150, height - 32, 10, 10);

  fill(0);
  textAlign(CENTER);
  textSize(18);
  textStyle(BOLD);
  text("Ebb & Flow of Energy on a Solar Powered Server", width / 2, 40);
}

function draw() {
  //background(0, 0, 0, 0.1)
  //stroke("#F4C008");
  stroke("#D4295E");
  drawPattern(width / 2, height / 2, 360, dataC, maxC);
  //stroke("#D6580C");
  stroke("#0063B2");
  drawPattern(width / 2, height / 2, 160, dataV, maxV);
}

function processVData(tempData) {
  // console.log(Object.keys(tempData.data));

  //put dates into arrays
  let dateStrings = Object.keys(tempData.data);
  //put values into an array
  let vals = Object.values(tempData.data);
  maxV = max(vals);

  //convert date strings into dayjs objects. Push date objects and values onto an array called dataV.
  for (let i = 0; i < dateStrings.length; i++) {
    dataV.push({ date: dayjs(dateStrings[i]), val: Number(vals[i]) });
  }

  //sort data by date so that it is in order
  dataV = dataV.sort((a, b) => (a.date.isAfter(b.date) ? 1 : -1));
  //print(dataV)
}

function processCData(tempData) {
  //put dates and vales into arrays
  let dateStrings = Object.keys(tempData.data);
  let vals = Object.values(tempData.data);
  maxC = max(vals);

  //convert date strings into dayjs objects. Push date objects and values onto an array called data.
  for (let i = 0; i < dateStrings.length; i++) {
    dataC.push({ date: dayjs(dateStrings[i]), val: Number(vals[i]) });
  }

  //sort data by date so that it is in order
  dataC = dataC.sort((a, b) => (a.date.isAfter(b.date) ? 1 : -1));
  //print(dataC);
}

function drawPattern(x, y, r, data, maxValue) {
  let index = frameCount % data.length;
  let angle = map(index, 0, data.length, 0, 360);

  let datum = data[index].val;
  //let diff = map(datum, 0, maxValue, - (r * 0.15), (r * 0.15));
  let diff = map(datum, 0, maxValue, 0, r * 0.45);
  push();
  translate(x, y);
  rotate(floor(angle));
  //stroke("yellow")
  strokeWeight(2);
  //line(x, y, (r + diff) * cos(-45), (r + diff) * sin(-45));
  line(
    r * cos(-45),
    r * sin(-45),
    (r + diff) * cos(-45),
    (r + diff) * sin(-45)
  );
  pop();
}
