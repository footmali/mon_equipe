<?php

// include composer autoload
require 'vendor/autoload.php';
use Intervention\Image\ImageManagerStatic as Image;
use Predis\Client as Predis;

date_default_timezone_set('UTC');
Image::configure(array('driver' => 'gd'));
$redis = new Predis();

$post = $_POST;

$watermark = __DIR__ . "/app/assets/images/watermark-banner.png"; // footmali logo

$file_name = strtolower(str_replace(' ', '_', $post['name'])); // convert team name to a lowercase & underscore

// original image 1200 x 900
$image  =  Image::make($post["image"])
            ->text('WWW.FOOTMALI.COM', 388, 433, function($font){
                $font->file(__DIR__ . "/app/assets/font/Oswald-Bold.ttf");
                $font->size(48);
                $font->color(array(255, 255, 255, 0.25));
            })
            ->text('WWW.FOOTMALI.COM', 388, 693, function($font){
                $font->file(__DIR__ . "/app/assets/font/Oswald-Bold.ttf");
                $font->size(48);
                $font->color(array(255, 255, 255, 0.25));
            })->save('public/teams/'. $file_name . '.png', 100);

$template = Image::make(__DIR__ . "/app/assets/images/facebook-template.png");
$footer   = Image::make(__DIR__ . "/app/assets/images/facebook-template-footer.png");
$temp_image    = $image->resize(768, null, function ($constraint) {
    $constraint->aspectRatio();
})->sharpen(8);
$facebook = Image::canvas(1200, 630, '#44bb44')
                ->insert($template)
                ->insert($temp_image, 'top-left', 16, 16)
                ->insert($footer, 'bottom-left')
                ->sharpen(2)
                ->save('public/teams/'. $file_name . '_facebook.png', 100);

// medium thumbnail
$medium =  Image::make($post["image"])->resize(221, null, function ($constraint) {
    $constraint->aspectRatio();
})->save('public/teams/'. $file_name . '_medium.png', 100);

// small thumbnail
$small  =  Image::make($post["image"])->resize(150, null, function ($constraint) {
    $constraint->aspectRatio();
})->save('public/teams/'. $file_name . '_small.png', 100);


// Array of all team metadata
$team = array(
    'name'      => $post['name'],
    'original'  => $image->basename,
    'facebook'  => $facebook->basename,
    'medium'    => $medium->basename,
    'small'     => $small->basename,
    'created'   => date('Y-m-d')
);

// redis operations
//$redis->hmset($file_name, $team); // save redis set with filename as key
//$redis->rpush("team_hashes", $file_name); // save set 'key' into list for retrieval

$return = json_encode($team);
print $return;
exit;

 ?>
