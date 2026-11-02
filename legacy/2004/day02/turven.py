fp = open('scores')
raw = []
data = fp.read()
lines = data.split('\r')
for line in lines:
	raw.append(line.split('\t'))
	
scores = {}
for i in range(17):
	scores[i] = 0
	
for y in range(16):
	line = lines[y]
	for x in range(14):
		key = int(raw[y][x])
		scores[key] += y+1
	
for key, value in scores.items():
	print key, value	
	