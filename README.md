# Interactive map of ebike trips vs MTA subway and bus routes

## How to use this map
Citi Bike launched [new Ebikes](https://ride.citibikenyc.com/blog/new-york-meet-your-new-ebike) on May 5, 2022 that made it even easier for able-bodied New Yorkers to speed around town. In some cases, these riders may be choosing ebikes because they are preferable to their public transit options. Through this map, you can compare the routes ebikers took between 9 to 10am on March 6, 2023 against current MTA subway and bus routes. Can you spot routes that people prefer to ebike over taking the train or bus?

Red lines show the potential routes ebikers took. These lines are transparent, so the thicker the line, the more popular the route. Ebike trip data is from [Citi Bike](https://s3.amazonaws.com/tripdata/index.html). Routes are estimated using MapBox's [Directions API](https://docs.mapbox.com/api/navigation/directions/).

Blue lines show MTA subway and bus routes. Subway routes are solid and bus route are dashed. Routes are sourced from the [Baruch College Geoportal's NYC Mass Transit Spatial Layers](https://www.baruch.cuny.edu/confluence/display/geoportal/NYC+Mass+Transit+Spatial+Layers).

## Lessons learned
- Navigating the limits of the Mapbox Directions API.
- Moment.js package for filtering trip start times.
- Working with MultiLineString geojson files (the train and bus routes are in MultiLineString format and wouldn't display initially).
- When to use GEOJson vs JSON (I ended up formatting the bike data as a Json instead of GEOJson to loop through it).

## Challenges and opportunities for further exploration
- I made my observation window extremely small - one hour - because the Mapbox Directions API has a 300 calls/minute limit. Assuming I can't find a way around this limit, I'd like to add features that allow the user to input the time window they'd like to observe.
- I already know from personal experience where I bike or ebike rather than take the train or bus. I'm sure other users might as well. I'd like to display routes at the borough or neighborhood level, or in known transit deserts, to answer my research question faster (and to minimize the number of times I call the API).
- It's hard to differentiate between the routes and public transit lines. I haven't found a feature that allows layers to be levitated/manipulated on the z-axis, but if it exists I'd like to try it. If it doesn't, I would like to continue adjusting the colors and layer visibility. For similar reasonining, I want to try adding direction arrows to routes.
- I think comparing members vs "casual" (Citi Bike terminology, not mine) users would be interesting. Could capture commuters vs joyriders - both seem worthy of study.
- I think a ride leaderboard of shortest and longest rides is a fun idea; it doesn't really fit with my research question though.

