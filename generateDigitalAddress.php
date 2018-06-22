<?php
include("db.php");

$data = json_decode(file_get_contents("php://input"));
$lat = $data->lat;
$long = $data->lng;

// call to mapcode web service


$digitalAddress["status"] = json_decode($digitaldata, TRUE)['local']['territory']." ".json_decode($digitaldata, TRUE)['local']['mapcode'];

// store the digital and physical addresses in local database

$obj = new databaseConnection();

$conn = $obj->dbConnect();

$obj->insertLocation($conn, $digitalAddress["status"],$data->state,$data->zip,$data->street,$data->town,$data->house,$lat,$long);

echo json_encode($digitalAddress);