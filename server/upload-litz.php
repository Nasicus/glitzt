<?php

$password = "<da musch dis super sicherheits pw setze bevor das uf dä server tuesch>";

function getGUID(){
    if (function_exists('com_create_guid')){
        return com_create_guid();
    }else{
        mt_srand((double)microtime()*10000);//optional for php 4.2.0 and up.
        $charid = strtoupper(md5(uniqid(rand(), true)));
        $hyphen = chr(45);// "-"
        $uuid = substr($charid, 0, 8).$hyphen
                 .substr($charid, 8, 4).$hyphen
                 .substr($charid,12, 4).$hyphen
                 .substr($charid,16, 4).$hyphen
                 .substr($charid,20,12);
        return $uuid;
    }
}

function isNullOrEmptyString($question){
    return (!isset($question) || trim($question)==='');
}

function uploadImage($inputPassword, $imageObj) {
    if ($inputPassword != $GLOBALS['password']) {
        throw new Exception("Falsches Passwort du Honk! Häts di halt glitzt.");
    }

    $targetDir = "../assets/litzes/";

    if (!file_exists($targetDir)) {
        mkdir($targetDir, 0777, true);
    }

    $maxFileSizeMB = 12;
    $maxFileSizeByte = $maxFileSizeMB * 1024 * 1024;
    // if tmp_name is null / empty the file was not uploaded because it was too large (php.ini setting!)
    if (isNullOrEmptyString($imageObj["tmp_name"]) || $imageObj["size"] > $maxFileSizeByte) {
        throw new Exception("S'File isch z'gross. Glitzt.");
    }

    $check = getimagesize($imageObj["tmp_name"]);
    if($check === false) {
        throw new Exception("Wetsch mi verarsche? Das isch gar keis Bild. En Litz direkt id Pfrässi git das!");
    }

    $imageFileType = pathinfo($imageObj["name"], PATHINFO_EXTENSION);

    $allowedExtensions = array('gif');
    if(!in_array($imageFileType, $allowedExtensions)) {
         throw new Exception("Du Hornochs numme " . implode(',', $allowedExtensions) . " sind erlaubt. Und Zack häts di glitzt.");
    }

    $targetName = getGUID() . "." . $imageFileType;
    $targetFile = $targetDir . $targetName;

    if (!move_uploaded_file($imageObj["tmp_name"], $targetFile)) {
         throw new Exception("Tuet mer leid, irgend en random error isch uftrete. Häts di halt trotzdem glitzt.");
    }

    return $targetName;
}

try
{
    echo uploadImage($_REQUEST["password"], $_FILES["image"]);
} catch (Exception $ex) {
    header("HTTP/1.1 500 Internal Server Error");
    echo $ex->getMessage();
}

?>