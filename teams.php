<?php

// include composer autoload
require 'vendor/autoload.php';

use Intervention\Image\ImageManagerStatic as Image;
use Predis\Client as Predis;

date_default_timezone_set('UTC');

Image::configure(array('driver' => 'gd'));
$redis = new Predis();
$response = array();

// get teams name keys
$teams = $redis->lrange("team_hashes", 0, -1);

// retrieve team data
foreach ($teams as $team) {
    array_push($response, $redis->hgetall($team));
}


// function cmp($a, $b)
// {
//     return $a['created'] < $b['created'];
// }
//
// usort($files, "cmp");

print json_encode($response);
exit;
?>
