/***********************************************************************
 * This script will parse data from two sources to create a consolidate
 * json file that contains zip code boundary data. The first source
 * is the US census bureau KML data. The second is the ZCTA data
 *
 * You can download sample files for both of these here:
 * https://www.dropbox.com/sh/w8rweu2d58p95ex/AADuf-ZKDJMmk_5sPLiN8ebCa?dl=0
 *
 * Usage:
 * $ node app.js <path_to_kml> <path_to_zcta>
 *
 * Output:
 * consolidated zip code data as a json file
***********************************************************************/
