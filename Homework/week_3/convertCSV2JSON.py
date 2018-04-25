import csv
import json
import sys

# first try to get the data i need rom obesity.csv from the WHO
# which is obesity % from both sexes

with open('obesitylim.csv', 'r') as csvObesity:
    csvObesityReader = csv.reader(csvObesity)

    with open('obesitas.json', 'w') as jsonObesity:
        for line in csvObesityReader:
            json.dump((line[0], line[1][:4], line[2][:4]), jsonObesity)
