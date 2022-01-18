/*
** node_helper module for MMM-Dorba-Trails
*/

var request = require('request');
var NodeHelper = require("node_helper");

//for parsing the returned HTML
const jsdom = require("jsdom");
const { JSDOM } = jsdom;


module.exports = NodeHelper.create({

	start: function () {
		console.log("Starting node helper: " + this.name);

	},

	socketNotificationReceived: function (notification, payload) {
		var self = this;
		console.log("Notification: " + notification + " Payload: " + payload);

		if (notification === "GET_TRAIL_STATUS") {
			var dorbaTrailsUrl = payload.config.url.replace("{trailIDs}", payload.config.trailIDs);
			request(dorbaTrailsUrl, function (error, response, body) {
				if (!error && response.statusCode == 200) {
					var dom = new JSDOM(body);
					var rows = dom.window.document.querySelectorAll("tbody tr");
					var jsonData = { trails: [] };
					rows.forEach(r => {
						var cols = r.cells;
						var name = r.cells[0].children[0].innerHTML;
						var statusOpen = r.cells[1].innerHTML.includes("sgreen");
						var lastCheck = r.cells[3].querySelectorAll("div div")[0].innerHTML;
						jsonData.trails.splice(0,0,{
							name: name,
							statusOpen: statusOpen,
							lastCheck: lastCheck
						});
					});
					self.sendSocketNotification("TRAIL_STATUS", jsonData);
				}
			});
		}
	},
});
