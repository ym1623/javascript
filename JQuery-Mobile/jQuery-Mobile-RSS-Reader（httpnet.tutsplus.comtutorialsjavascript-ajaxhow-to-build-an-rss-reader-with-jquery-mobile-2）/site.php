<?php
// If "siteName" isn't in the querystring, set the default site name to 'nettuts'
$siteName = empty($_GET['siteName']) ? 'nettuts' : $_GET['siteName'];

$siteList = array(
   'nettuts',
   'flashtuts',
   'webdesigntutsplus',
   'psdtuts',
   'vectortuts',
   'phototuts',
   'mobiletuts',
   'cgtuts',
   'audiotuts',
   'aetuts'
);

// For security reasons. If the string isn't a site name, just change to 
// nettuts instead.
if ( !in_array($siteName, $siteList) ) {
   $siteName = 'nettuts';
}

$cache = dirname(__FILE__) . "/cache/$siteName";
// Re-cache every three hours
if(filemtime($cache) < (time() - 10800))
{
   // Get from server
   if ( !file_exists(dirname(__FILE__) . '/cache') ) {
      mkdir(dirname(__FILE__) . '/cache', 0777);
   }
   // YQL query (SELECT * from feed ... ) // Split for readability
   $path = "http://query.yahooapis.com/v1/public/yql?q=";
   $path .= urlencode("SELECT * FROM feed WHERE url='http://feeds.feedburner.com/$siteName'");
   $path .= "&format=json";

   // Call YQL, and if the query didn't fail, cache the returned data
   $feed = file_get_contents($path, true);

   // If something was returned, cache
   if ( is_object($feed) && $feed->query->count ) {
      $cachefile = fopen($cache, 'wb');
      fwrite($cachefile, $feed);
      fclose($cachefile);
   }
}
else
{
   // We already have local cache. Use that instead.
   $feed = file_get_contents($cache);
}

// Decode that shizzle
$feed = json_decode($feed);

// Activetuts is still using the old Flashtuts RSS path.
if ( $siteName === 'flashtuts' ) $siteName = 'activetuts';
else if ( $siteName === 'webdesigntutsplus' ) $siteName = 'webdesigntuts';

// Include the view
include('views/site.tmpl.php');

