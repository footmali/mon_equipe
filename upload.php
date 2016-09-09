<?php

// include composer autoload
require 'vendor/autoload.php';
use Intervention\Image\ImageManagerStatic as Image;
use Predis\Client as Predis;

date_default_timezone_set('UTC');
Image::configure(array('driver' => 'gd'));
$redis = new Predis();

$post = $_POST;

$watermark = __DIR__ . "/app/assets/images/logo.png"; // footmali logo
$file_name = strtolower(str_replace(' ', '_', $post['name'])); // convert team name to a lowercase & underscore

// original image
$image  =  Image::make($post["image"])
            ->insert($watermark, 'bottom-right')
            ->text('www.footmali.com', 50, 974, function($font){
                $font->size(24);
                $font->color(array(255, 255, 255, 0.5));
            });

// medium thumbnail
$medium =  Image::make($post["image"])->resize(221, null, function ($constraint) {
    $constraint->aspectRatio();
});

// small thumbnail
$small  =  Image::make($post["image"])->resize(150, null, function ($constraint) {
    $constraint->aspectRatio();
});

// save the images
$image->save('public/teams/'. $file_name . '.png');
$medium->save('public/teams/'. $file_name . '_medium.png');
$small->save('public/teams/'. $file_name . '_small.png');

// Array of all team metadata
$team = array(
    'name'      => $post['name'],
    'original'  => $image->basename,
    'medium'    => $medium->basename,
    'small'     => $small->basename,
    'created'   => date('Y-m-d')
);

// redis operations
$redis->hmset($file_name, $team); // save redis set with filename as key
$redis->rpush("team_hashes", $file_name); // save set 'key' into list for retrieval

$return = json_encode($team);
print $return;
exit;

 ?>
