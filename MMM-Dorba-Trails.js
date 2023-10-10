/*
 * MagicMirror² module for displaying Dorba Trail status info
 * By drventure, roughly based on Thomas Krywitsky https://github.com/tkrywit/MMM-Solar
 * MIT Licensed
 */

Module.register("MMM-Dorba-Trails", {
  // Default module config.
  defaults: {
    url: "https://www.trailforks.com/widgets/region_list/?rids={trailIDs}&cols=title,status,city_title,last_report_ts",
    trailIDs: "3723,19031,5025",
    refInterval: 1000 * 60 * 60 * 6, // once every 6 hours
    basicHeader: false
    //trail status url
    //https://www.trailforks.com/widgets/region_list/?rids=35629,3719,13783,3726,5016,22007,13746,14710,22005,22065,5025,5022,3723,19612,24208,33774,33812,25637,19031,5018,13750,13751,34284,5020,24408,5021,17590,23481,3717,13827,13829,28103,24406,45471,38370&rows=75&w=600px&h=1200px&cols=title,status,city_title,last_report_ts

    //test url with 3 trails
    //https://www.trailforks.com/widgets/region_list/?rids=3723,35629,3719&rows=75&w=600px&h=1200px&cols=title,status,city_title,last_report_ts

    //trail ids
    //35629,3719,13783,3726,5016,22007,13746,14710,22005,22065,5025,5022,3723,19612,24208,33774,33812,25637,19031,5018,13750,13751,34284,5020,24408,5021,17590,23481,3717,13827,13829,28103,24406,45471,38370
  },

  start() {
    // Logging appears in Chrome developer tools console
    Log.info(`Starting module: ${this.name}`);

    this.loaded = false;
    this.getTrailStatus();

    if (this.config.basicHeader) {
      this.data.header = "Dorba Trail Status";
    }

    const self = this;
    // Schedule updates
    setInterval(() => {
      self.getTrailStatus();
      self.updateDom();
    }, this.config.refInterval);
  },

  // Import additional CSS Styles
  getStyles() {
    return ["dorba-trails.css"];
  },

  // Contact node helper for trail status info
  getTrailStatus() {
    Log.info("MMM-Dorba-Trails: Getting data");

    this.sendSocketNotification("GET_TRAIL_STATUS", {
      config: this.config
    });
  },

  //Handle node helper response
  socketNotificationReceived(notification, payload) {
    Log.info(`MMM-Dorba-Trails: received notification ${notification}`);
    if (notification === "TRAIL_STATUS") {
      if (payload.error) {
        console.error(
          `MMM-Dorba-Trails: Error fetching data - ${payload.error}`
        );
      } else {
        this.results = payload;
        this.loaded = true;
        this.updateDom(1000);
      }
    }
  },

  // Override dom generator.
  getDom() {
    const wrapper = document.createElement("div");

    // Display loading while waiting for API response
    if (!this.loaded) {
      wrapper.innerHTML = "Loading...";
      return wrapper;
    }

    if (this.results.trails.length === 0) {
      wrapper.innerHTML = `Unavailable<br>${this.results.error}`;
      return wrapper;
    }

    const tableRows = [];
    this.results.trails.forEach((trail) => {
      const row = document.createElement("tr");
      const nameTd = document.createElement("td");
      const statusTd = document.createElement("td");
      const lastCheckTd = document.createElement("td");

      nameTd.innerHTML = trail.name;
      statusTd.innerHTML = trail.statusOpen
        ? '<i class="fas fa-check-circle"></i>'
        : '<i class="far fa-times-circle"></i>';
      lastCheckTd.innerHTML = trail.lastCheck;

      nameTd.className += " medium regular bright";
      statusTd.className += " medium light normal";
      lastCheckTd.className += " medium light normal";

      row.appendChild(nameTd);
      row.appendChild(statusTd);
      row.appendChild(lastCheckTd);

      tableRows.push(row.outerHTML);
    });

    const table = document.createElement("table");
    table.innerHTML = tableRows.join("");

    wrapper.appendChild(table);
    return wrapper;
  }
});
