<?php
require 'functions.php';

$metadata = make_image();
save_to_redis($metadata);

$response = json_encode($metadata['team']);
header('Content-Type: application/json');
die(json_encode($response));

 ?>
