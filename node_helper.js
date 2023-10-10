/*
 ** node_helper module for MMM-Dorba-Trails
 */

var bent = require("bent");
var NodeHelper = require("node_helper");

//for parsing the returned HTML
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

module.exports = NodeHelper.create({
  start: function () {
    console.log(`Starting node helper: ${this.name}`);
  },

  socketNotificationReceived: async function (notification, payload) {
    var self = this;
    console.log(`TRAILS: Notification: ${notification} Payload: ${payload}`);

    if (notification === "GET_TRAIL_STATUS") {
      var dorbaTrailsUrl = payload.config.url.replace(
        "{trailIDs}",
        payload.config.trailIDs
      );

      var jsonData = { trails: [], error: "" };

      console.log("TRAILS: get Bent");

      const url = `${dorbaTrailsUrl}&client=MMM-Dorba-Trails`;
      const request = bent("string", "GET", {
        //"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36 Edg/110.0.1587.63",
        "User-Agent": "Node/12.14.1"
        // "accept-encoding": "gzip, deflate, br",
        // "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        // "upgrade-insecure-requests": "1",
        // "dnt": '1',
        // "accept-language": "en-US,en;q=0.9",
        // "Connection": "close",
        // "X-Forwarded-Proto": "https",
        // "cache-control": "max-age=0",
        // "sec-ch-ua": '"Chromium";v="110", "Not A(Brand";v="24", "Google Chrome";v="110"',
        // "sec-ch-ua-mobile": "?0",
        // "sec-ch-ua-platform": "Windows",
        // "sec-fetch-dest": "document",
        // "sec-fetch-mode": "navigate",
        // "sec-fetch-site": "none",
        // "sec-fetch-user": "?1",
      });
      try {
        console.log(`TRAILS: fetching ${url}`);
        var body = await request(url);
        console.log(`TRAILS: got body ${body}`);

        var dom = new JSDOM(body);
        var rows = dom.window.document.querySelectorAll("tbody tr");
        rows.forEach((r) => {
          var cols = r.cells;
          var name = r.cells[0].children[0].innerHTML;
          var statusOpen = r.cells[1].innerHTML.includes("sgreen");
          var lastCheck = r.cells[3].querySelectorAll("div div")[0].innerHTML;
          jsonData.trails.splice(0, 0, {
            name: name,
            statusOpen: statusOpen,
            lastCheck: lastCheck
          });
        });

        console.log("TRAILS: send status");
        self.sendSocketNotification("TRAIL_STATUS", jsonData);
      } catch (error) {
        console.log(`TRAILS: error ${error}`);
        jsonData.error = error.toString();
        self.sendSocketNotification("TRAIL_STATUS", jsonData);
      }
    }
  }
});
