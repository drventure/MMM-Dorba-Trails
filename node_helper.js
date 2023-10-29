/*
 ** node_helper module for MMM-Dorba-Trails
 */
var NodeHelper = require("node_helper");

// for parsing the returned HTML
const { JSDOM } = require("jsdom");

module.exports = NodeHelper.create({
  start() {
    console.log(`Starting node helper: ${this.name}`);
  },

  async socketNotificationReceived(notification, payload) {
    console.log(
      `MMM-Dorba-Trails: Notification: ${notification} Payload: ${payload}`
    );

    if (notification === "GET_TRAIL_STATUS") {
      const dorbaTrailsUrl = payload.config.url.replace(
        "{trailIDs}",
        payload.config.trailIDs
      );

      const jsonData = { trails: [], error: "" };
      const url = `${dorbaTrailsUrl}&client=MMM-Dorba-Trails`;

      try {
        console.log(`MMM-Dorba-Trails: fetching ${url}`);
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        const body = await response.text();
        console.log(`MMM-Dorba-Trails: got body`);

        const dom = new JSDOM(body);
        const rows = dom.window.document.querySelectorAll("tbody tr");
        rows.forEach((row) => {
          const name = row.cells[0].children[0].innerHTML;
          const statusOpen = row.cells[1].innerHTML.includes("sgreen");
          const lastCheck =
            row.cells[3].querySelectorAll("div div")[0].innerHTML;
          jsonData.trails.splice(0, 0, {
            name,
            statusOpen,
            lastCheck
          });
        });

        console.log("MMM-Dorba-Trails: send status");
        this.sendSocketNotification("TRAIL_STATUS", jsonData);
      } catch (error) {
        console.error(`MMM-Dorba-Trails: error ${error}`);
        jsonData.error = error.toString();
        this.sendSocketNotification("TRAIL_STATUS", jsonData);
      }
    }
  }
});
