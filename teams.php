<?php
require 'functions.php';

$response = get_squads();

header('Content-Type: application/json');
die($response);

?>
