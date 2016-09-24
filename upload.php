<?php

// include composer autoload
require 'vendor/autoload.php';
use Intervention\Image\ImageManagerStatic as Image;
use Predis\Client as Predis;

date_default_timezone_set('UTC');

/**
* Generate images
**/
function make_image() {
    $post = $_POST;

    try {

        Image::configure(array('driver' => 'gd'));

        // convert team name to a lowercase & underscore
        $file_name = strtolower(str_replace(' ', '_', $post['name']));

        // generate new uid
        $id = uniqid();

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
                    })->save('public/teams/'. $file_name . '_' . $id . '.png', 100);

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
                        ->save('public/teams/'. $file_name . '_' . $id . '_facebook.png', 100);

        // medium thumbnail
        $medium =  Image::make($post["image"])->resize(221, null, function ($constraint) {
            $constraint->aspectRatio();
        })->save('public/teams/'. $file_name . '_' . $id . '_medium.png', 100);

        // small thumbnail
        $small  =  Image::make($post["image"])->resize(150, null, function ($constraint) {
            $constraint->aspectRatio();
        })->save('public/teams/'. $file_name . '_' . $id . '_small.png', 100);


        // Array of all team metadata
        $team = array(
            '_id'       => $id,
            'filename'  => $file_name,
            'name'      => $post['name'],
            'image_original'  => $image->basename,
            'image_facebook'  => $facebook->basename,
            'image_medium'    => $medium->basename,
            'image_small'     => $small->basename,
            'created'   => date('Y-m-d')
        );

        return array(
            'id'        => $id,
            'file_name'  => $file_name,
            'team'      => $team
        );
    } catch (Exception $e) {
        $response = json_encode(array(
                        'statusCode' => http_response_code(500),
                        'code' => 'image'
                    ));

        print $response;
        exit;
    }
}


/**
* Save metadata to redis
**/
function save_to_redis($metadata) {
    // redis operations
    try {
        $redis = new Predis();
        $redis->hmset($metadata['id'], $metadata['team']); // save redis set with filename as key
        $redis->rpush("team_hashes", $metadata['file_name']); // save set 'key' into list for retrieval
    } catch (Exception $e) {
        $response = json_encode(array(
                        'statusCode' => http_response_code(500),
                        'code' => 'redis'
                    ));

        print $response;
        exit;
    }
}

$metadata = make_image();
//save_to_redis($metadata);

$response = json_encode($metadata['team']);
print $response;
exit;

 ?>
