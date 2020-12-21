const csvToJson = require('convert-csv-to-json');


module.exports.jsonCities = csvToJson.fieldDelimiter(',')
    .formatValueByType()
    .getJsonFromCsv("./seeds/worldcities.csv");

/* 
{
  city: 'Guangzhou',
  city_ascii: 'Guangzhou',
  lat: 23.1288,
  lng: 113.259,
  country: 'China',
  iso2: 'CN',
  iso3: 'CHN',
  admin_name: 'Guangdong',
  capital: 'admin',
  population: 20902000,
  id: 1156237133
}
*/