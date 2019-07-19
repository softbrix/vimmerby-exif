/**
 * Extracts Sanyo flavored Makernotes.
 */
exports.extractMakernotes = function (data, makernoteOffset, tiffOffset) {

  // List of vendor specific Makernote tags found on
  // http://www.sno.phy.queensu.ca/~phil/exiftool/TagNames/Canon.html
  var tags = {
    0x0006 : "CanonImageType",
    0x0035 : { tag: "TimeInfo",
               format: parseCanonTimeInfo
             },
  };

  // Canon flavored Makernote data starts straight away!
  var ifdOffset = makernoteOffset;

  // Get the number of entries and extract them
  var numberOfEntries = data.getShort(ifdOffset, this.isBigEndian);

  var makernoteData = {};

  for (var i = 0; i < numberOfEntries; i++) {
    var exifEntry = this.extractExifEntry(data, (ifdOffset + 2 + (i * 12)), tiffOffset, this.isBigEndian, tags);
    if (exifEntry && exifEntry.tagName) {
      makernoteData[exifEntry.tagName] = exifEntry.value;
    }
  }

  return makernoteData;
};


function parseCanonTimeInfo(offset, data) {
  var value = {};
  value.TimeZone = data.getSignedLong(offset + 4, this.isBigEndian);
  value.TimeZoneCity = data.getLong(offset + 2 * 4, this.isBigEndian);
  value.DaylightSavings = data.getLong(offset + 3 * 4, this.isBigEndian) ? true : false;

  return value;
}

