# MMM-Dorba-Trails
A Simple Module for MagicMirror2 designed to parse Dorba Mountain Bike Trail status.

The actual trail status comes from the site trailforks.com

The module is named after the Dallas Off Road Bike Association, which has introduced me to a ton of
trails around the Dallas-Ft Worth area.

## Dependencies
  * A [MagicMirror<sup>2</sup>](https://github.com/MichMich/MagicMirror) installation

## Installation
  1. Clone repo into MagicMirror/modules directory
        cd ~/MagicMirror/modules
        git clone https://github.com/drventure/MMM-Dorba-Trails.git
  2. Create an entry in 'config/config.js' with the trails you want to monitor

 **Example:**
```
 {
    module: 'MMM-Dorba-Trails',
    position: 'bottom_left',
    config: {
      url: "https://www.trailforks.com/widgets/region_list/?rids={trailIDs}&cols=title,status,city_title,last_report_ts",
      trailIDs: "3721"
	}
 },
```

trailIDs is a comma delimited list of trail ids from the trailforks.com trail guide website.

To find a trailID: 

Got to trailforks.com

Search for your trail.

Once you find the trail you're interested in, "View Page Source" in your browser.

Search for the text "?rid=" (without the quotes)

You should find an instance of a line that looks something like this:

https://www.trailforks.com/contribute/trail/?rid=3723

The 3723 is the trail ID.


## Sample
![alt text](https://github.com/drventure/MMM-Dorba-Trails/blob/main/MMM-Dorba-Trails.png "Example")


## Optional Config
| **Option** | **Description** |
| --- | --- |
| none | None at this time |

