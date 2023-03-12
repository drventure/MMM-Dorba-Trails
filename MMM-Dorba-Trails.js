/*
* Magic Mirror module for displaying Dorba Trail status info
* By drventure, roughly based on Thomas Krywitsky https://github.com/tkrywit/MMM-Solar
* MIT Licensed
*/

Module.register("MMM-Dorba-Trails", {
    // Default module config.
    defaults: {
        url: "https://www.trailforks.com/widgets/region_list/?rids={trailIDs}&cols=title,status,city_title,last_report_ts",
        trailIDs: "3723,19031,5025",
        refInterval: 1000 * 60 * 60 * 6, //once every 6 hours
        basicHeader: false,
        //trail status url
        //https://www.trailforks.com/widgets/region_list/?rids=35629,3719,13783,3726,5016,22007,13746,14710,22005,22065,5025,5022,3723,19612,24208,33774,33812,25637,19031,5018,13750,13751,34284,5020,24408,5021,17590,23481,3717,13827,13829,28103,24406,45471,38370&rows=75&w=600px&h=1200px&cols=title,status,city_title,last_report_ts
        
        //test url with 3 trails
        //https://www.trailforks.com/widgets/region_list/?rids=3723,35629,3719&rows=75&w=600px&h=1200px&cols=title,status,city_title,last_report_ts

        //trail ids
        //35629,3719,13783,3726,5016,22007,13746,14710,22005,22065,5025,5022,3723,19612,24208,33774,33812,25637,19031,5018,13750,13751,34284,5020,24408,5021,17590,23481,3717,13827,13829,28103,24406,45471,38370
    },

    start: function () {
        // Logging appears in Chrome developer tools console
        Log.info("Starting module: " + this.name);

        // this.titles = ["Current Solar Power:", "Daily Energy:", "Last Month:", "Year To Date:", "Lifetime Energy:"];
        // this.suffixes = ["Watts", "kWh", "kWh", "kWh", "MWh"];
        // this.results = ["Loading", "Loading", "Loading", "Loading", "Loading"];
        this.loaded = false;
        this.getTrailStatus();

        if (this.config.basicHeader) {
            this.data.header = 'Dorba Trail Status';
        }

        var self = this;
        //Schedule updates
        setInterval(function () {
            self.getTrailStatus();
            self.updateDom();
        }, this.config.refInterval);
    },



    //Import additional CSS Styles
    getStyles: function () {
        return ['dorba-trails.css']
    },

    //Contact node helper for trail status info
    getTrailStatus: function () {
        Log.info("Dorba Trails: getting data");

        this.sendSocketNotification("GET_TRAIL_STATUS", {
            config: this.config
        });
    },

    //Handle node helper response
    socketNotificationReceived: function (notification, payload) {
        Log.info("Dorba Trails: received notification " + notification);
        if (notification === "TRAIL_STATUS") {
            this.results = payload;
            this.loaded = true;
            this.updateDom(1000);
        }
    },

    // Override dom generator.
    getDom: function () {

        var wrapper = document.createElement("div");

        // no api keys for this module
        // if (this.config.apiKey === "" || this.config.siteId === "") {
        //     wrapper.innerHTML = "Missing configuration.";
        //     return wrapper;
        // }

        //Display loading while waiting for API response
        if (!this.loaded) {
            wrapper.innerHTML = "Loading...";
            return wrapper;
        }

        if (this.results.trails.length == 0) {
            wrapper.innerHTML = "Unavailable<br>" + this.results.error;
            return wrapper;
        }

        var tb = document.createElement("table");

        if (!this.config.basicHeader) {
            /* remove header because space is tight
            var imgDiv = document.createElement("div");
            imgDiv.setAttribute("class", "title");
            var img = document.createElement("img");
            img.src = "/modules/MMM-SolarEdge/solar_white.png";

            var sTitle = document.createElement("span");
            sTitle.innerHTML = "SolarEdge PV";
            sTitle.className += " thin large";
            imgDiv.appendChild(img);
            imgDiv.appendChild(sTitle);

            var divider = document.createElement("hr");
            divider.className += " dimmed";
            wrapper.appendChild(imgDiv);
            wrapper.appendChild(divider);
            */
        }

        this.results.trails.forEach(t => {
            var row = document.createElement("tr");

            var nameTd = document.createElement("td");
            var statusTd = document.createElement("td");
            var lastCheckTd = document.createElement("td");

            nameTd.innerHTML = t.name;
            statusTd.innerHTML = t.statusOpen ? '<i class="fas fa-check-circle"></i>' : '<i class="far fa-times-circle"></i>';
            lastCheckTd.innerHTML = t.lastCheck;
            nameTd.className += " medium regular bright";
            statusTd.className += " medium light normal";
            lastCheckTd.className += " medium light normal";

            row.appendChild(nameTd);
            row.appendChild(statusTd);
            row.appendChild(lastCheckTd);

            tb.appendChild(row);
        });
        wrapper.appendChild(tb);
        return wrapper;
    }
});
