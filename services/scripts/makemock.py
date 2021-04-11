import json
import sys

if len(sys.argv) < 3:
    print("not enough arguments")
    exit(-1)

with open(sys.argv[1], 'r') as f:
    data = json.load(f)

for key in data:
    data[key] = json.dumps(data[key])

with open(sys.argv[2], 'w') as f:
    f.write(json.dumps(data))