# Adapted from: https://chenyuzuoo.github.io/posts/56646/

import csv

# Read in raw data from csv
rawData = csv.reader(open('data/202303-citibike-tripdata.csv', 'rt'), dialect='excel')

# the template. where data from the csv will be formatted to geojson
template = \
   ''' \
   { "id" : "%s", "start_time" : "%s", "end_time": "%s", "bike_type" : "%s", "user_type": "%s", "start_lon": "%s", "start_lat": "%s", "end_lon": "%s", "end_lat": "%s", "start_station": "%s", "end_station": "%s"},
   '''

# the head of the geojson file
output = \
   ''' \

{ "type": "FeatureCollection",
   "features" : [
   '''


# loop through the csv
iter = 0
i=0
for row in rawData:
   iter += 1
   i == 0
   # skip first row
   # exclude trips with start but no end
   # filter for trips week of Mon 3/06/2023 to Sun 3/12/2023
   # filter for ebike trips
   if iter >= 2 and (len(row[10]) != 0 or len(row[11]) != 0) and (row[2][0:10] == "2023-03-06" or row[2][0:10] == "2023-03-07" or row[2][0:10] == "2023-03-08" or row[2][0:10] == "2023-03-09" or row[2][0:10] == "2023-03-10" or row[2][0:10] == "2023-03-11" or row[2][0:10] == "2023-03-12") and row[1][0:13] == "electric_bike":
      i +=1 # count output rows
      id = str(row[0])
      start_lat = str(row[8])
      start_lng = str(row[9])
      end_lat = str(row[10])
      end_lng = str(row[11])
      start_time = str(row[2])
      end_time = str(row[3])
      bike_type = str(row[1])
      user_type = str(row[12])
      start_station = str(row[4])
      end_station = str(row[6])
      output += template % (id, start_time, end_time, bike_type, user_type, start_lng, start_lat, end_lng, end_lat, start_station, end_station)
      #if i > 99: break

#"EAB9FFEAB7BDBAF2","classic_bike","2023-03-15 18:11:59","2023-03-15 18:18:38","6 Ave & W 33 St","6364.07","9 Ave & W 22 St","6266.06",40.748422623,-73.988208175,40.7454973,-74.00197139,"member"

#0ride_id",
# 1"rideable_type",
# 2"started_at",
# 3"ended_at","
# 4start_station_name","
# 5start_station_id","
# 6end_station_name","
# 7end_station_id","
# 8start_lat","
# 9start_lng","
# 10end_lat",
# 11"end_lng","
# 12 member_casual"

# the tail of the geojson file
output += \
   ''' \
   ]

}
   '''


# opens an geoJSON file to write the output
outFileHandle = open("data/230303citibike.json", "w")
outFileHandle.write(output)
outFileHandle.close()
