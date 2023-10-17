<?php
  header('Access-Control-Allow-Origin: *'); 

  function getRandomFile($dir)
  {
     $files = glob($dir . "/*.*");
     $file = array_rand($files);
     return $files[$file];
  }

  $imagePath = getRandomFile("../assets/litzes");

  if ($_GET["asImage"] == "true") {
    $fp = fopen($imagePath, 'rb');

    header("Content-Type: image/gif");
    header("Content-Length: " . filesize($imagePath));

    fpassthru($fp);
  } else {
    header("Content-Type: application/json");
    echo json_encode(basename($imagePath));
  }
?>