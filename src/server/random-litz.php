<?php
  function getRandomFile($dir)
  {
     $files = glob($dir . "/*.*");
     $file = array_rand($files);
     return $files[$file];
  }

  header("Content-Type: application/json");
  echo json_encode(basename(getRandomFile("../assets/litzes")));
?>