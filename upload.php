<?php

// include composer autoload
require 'vendor/autoload.php';
use Intervention\Image\ImageManagerStatic as Image;

Image::configure(array('driver' => 'gd'));
$post = $_POST;

$image =  Image::make($post["image"]);

$file_name = strtolower(str_replace(' ', '_', $post['name']));
$image->save('public/teams/'. $file_name . '.png');

$return_data = 'public/teams/'. $file_name . '.png';

print $return_data;
exit;

 ?>
