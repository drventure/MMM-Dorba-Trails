# MMM-Dorba-Trails

A Simple Module for MagicMirror² designed to parse Dorba Mountain Bike Trail status.

The actual trail status comes from the site [trailforks.com](https://www.trailforks.com/)

The module is named after the Dallas Off Road Bike Association, which has introduced me to a ton of trails around the Dallas-Ft Worth area.

## Dependencies

* A [MagicMirror²](https://github.com/MichMich/MagicMirror) installation

## Installation

### Clone repo into MagicMirror/modules directory

```bash
cd ~/MagicMirror/modules
git clone https://github.com/drventure/MMM-Dorba-Trails
cd MMM-Dorba-Trails
npm install
```

### Create an entry in `config/config.js` with the trails you want to monitor

#### Example

```javascript
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

### To find a trailID

* Got to <https://www.trailforks.com/>
* Search for your trail.
* Once you find the trail you're interested in, "View Page Source" in your browser.
* Search for the text "?rid=" (without the quotes)
* You should find an instance of a line that looks something like this: <https://www.trailforks.com/contribute/trail/?rid=3723>

The `3723` is the trailID.

## Sample

![alt text](https://github.com/drventure/MMM-Dorba-Trails/blob/main/MMM-Dorba-Trails.png "Example")
