import csv
import json
import sys

array = []
counter = 0

with open('obesitylim.csv', 'r') as csvObesity:
    csvObesityReader = csv.reader(csvObesity)
    for row in csvObesityReader:
        counter = counter + 1
        if counter > 4:
            data = dict()
            data["Country"] = row[0]
            data["Boy"] = row[1][:4]
            data["Girl"] = row[2][:4]
            array.append(data)

datagroot = {"All_data": array}

with open('obesitas.json', 'w') as jsonObesity:
    json.dump(datagroot, jsonObesity)
