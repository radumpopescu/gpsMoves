var $ = require('jQuery')
var piexif = require('piexifjs');
var fs = require("fs");

function degToDmsRational(degFloat) {
  var minFloat = degFloat % 1 * 60
  var secFloat = minFloat % 1 * 60
  var deg = Math.floor(degFloat)
  var min = Math.floor(minFloat)
  var sec = Math.round(secFloat * 100)

  return [[deg, 1], [min, 1], [sec, 100]]
}

function handleFileSelect(evt) {

	var fileName = evt.target.files[0].path;

	var lat = 59.43553989213321;
	var lng = 24.73842144012451;

	setImageGps(fileName, lat, lng);
	console.log("gata");
}
function setImageGps(fileName, lat, lng)
{
	var jpeg = fs.readFileSync(fileName);
	var data = jpeg.toString("binary");
	var exifObj = piexif.load(data);;

	exifObj.GPS[piexif.GPSIFD.GPSLatitudeRef] = lat < 0 ? 'S' : 'N';
	exifObj.GPS[piexif.GPSIFD.GPSLatitude] = degToDmsRational(lat);
	exifObj.GPS[piexif.GPSIFD.GPSLongitudeRef] = lng < 0 ? 'W' : 'E';
	exifObj.GPS[piexif.GPSIFD.GPSLongitude] = degToDmsRational(lng);

	var exifbytes = piexif.dump(exifObj);
	var newData = piexif.insert(exifbytes, data);
	var newJpeg = new Buffer(newData, "binary");
	fs.writeFileSync(fileName, newJpeg);
}

document.getElementById('files').addEventListener('change', handleFileSelect, false);
