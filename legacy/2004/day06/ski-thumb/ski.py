from glob import glob

fs  = glob('*.jpg')
for f in fs:
	print """<a href="#" class="noborder" onclick="pop('/image.php?img=day06/ski-img/%s',400,400)"><img src="day06/ski-thumb/%s" alt="" /></a>""" % (f, f)