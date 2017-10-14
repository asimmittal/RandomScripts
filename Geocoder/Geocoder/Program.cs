using System;
using System.Net;
using System.Text;
using System.IO;
using System.Json;

namespace Geocoder
{   
    /// <summary>
    /// LatLng - Simple class to store latitude / longitude values
    /// </summary>
    public class LatLng
    {
        public double lat;
        public double lng;
        bool _isValid;

        public LatLng()
        {
            _isValid = false;
        }

        public bool setValue(double _lat, double _lng)
        {
            _isValid = false;
            if ((_lat >= -90 && _lat <= 90) && (_lng >= -180 && _lng <= 180))
            {
                _isValid = true;
                lat = _lat;
                lng = _lng;
            }

            return _isValid;
        }

        public bool IsValid
        {
            get { return _isValid; }
        }

        public override string ToString()
        {
            return lat + "," + lng;
        }
    }

    /// <summary>
    /// Creates a Google Maps Geocoder
    /// </summary>
    public class GoogleMapsGeocoder
    {
        string apiKey = null;

        public GoogleMapsGeocoder(string key){
            if (!String.IsNullOrEmpty(key)) apiKey = key;
        }

        public LatLng geocodeAddrToCoords(string address){

            //construct the URL
            string baseUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=(%addr)&key=(%key)";
            string urlEncodedAddr = Uri.EscapeUriString(address);
            string url = baseUrl.Replace("(%addr)", urlEncodedAddr).Replace("(%key)", apiKey);

            //request for geocoding
            HttpWebRequest myReq = (HttpWebRequest)WebRequest.Create(url);
            HttpWebResponse resp = (HttpWebResponse)myReq.GetResponse();
            Stream respStream = resp.GetResponseStream();
            StreamReader reader = new StreamReader(respStream, Encoding.UTF8);
            string response = reader.ReadToEnd().ToLower();
            var respJson = JsonValue.Parse(response);

            //we'll store lat lng values in here
            LatLng locData = new LatLng();

            //analyze the response
            if(respJson["status"] == "ok"){
                var location = respJson["results"][0]["geometry"]["location"];
                double lat = location["lat"];
                double lng = location["lng"];
                locData.setValue(lat,lng);
            }

            return locData;
        }

        public static void Main(string[] args)
        {
            //create a geocoder with a specified api key
            GoogleMapsGeocoder gc = new GoogleMapsGeocoder("AIzaSyD8T8vB5hruqJXmlKUGvoEV9ihSCIICeMk");

            //specify a list of addresses to be geocoded
            string[] addresses = {
                "129 W 29th St, New York, NY 10001, USA",
                "9717 Nobel Drive, San Diego",
                "Little red riding hood went into town"
            };

            //loop through and geocode them all
            for (var i = 0; i < addresses.Length; i++){
                var addr = addresses[i];
                LatLng location = gc.geocodeAddrToCoords(addr);
                if(location.IsValid) Console.Out.WriteLine(addr + " --> " + location.lat + "," + location.lng);
                else Console.Out.WriteLine(addr + " --> " + "Error in geocoding");
            }
		}
    }
}
