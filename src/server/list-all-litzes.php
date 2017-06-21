<?php
  header('Content-Type: application/json');
  echo json_encode(array_slice(scandir('../assets/litzes'), 2));
?>