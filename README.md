# MMM-Dorba-Trails
A Simple Module for MagicMirror2 designed to parse Dorba Mountain Bike Trail status

## Dependencies
  * A [MagicMirror<sup>2</sup>](https://github.com/MichMich/MagicMirror) installation

## Installation
  1. Clone repo into MagicMirror/modules directory
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
## Sample
![alt text](https://github.com/drventure/MMM-Dorba-Trails/blob/master/Dorba-Trails.png "Example")

## Optional Config
| **Option** | **Description** |
| --- | --- |
| `basicHeader` | Set to `true` to substitute the 'Dorba Trails' text and graphic for the default MagicMirror header |

