<?php

if(isset($_GET['avatar'], $_GET['sessionid'])) {
    
    $nl = "\r\n";
    $fp = fsockopen("avatars.wordfeud.com", 80);
    
    fputs($fp, "GET http://avatars.wordfeud.com/60/" . $_GET['avatar'] . " HTTP/1.0" . $nl);
    fputs($fp, "Host: avatars.wordfeud.com" . $nl);
    fputs($fp, "Cookie: sessionid=" . $_GET['sessionid'] . $nl);
    fputs($fp, $nl);
    
    for($response=''; !feof($fp); $response.=fgets($fp, 128));
    list($header, $content) = explode($nl . $nl, $response, 2);
    
    header('Content-Type: image/jpeg');
    header('Content-Length: ' . strlen($content));
    
    echo $content;
    
    die(0);
}

if(!isset($_POST['url'], $_POST['data'])) {
    die('false');
}

$nl = "\r\n";
$fp = fsockopen("game02.wordfeud.com", 80);

fputs($fp, "POST http://game02.wordfeud.com/wf/" . $_POST['url'] . "/ HTTP/1.0" . $nl);
fputs($fp, "Host: game02.wordfeud.com" . $nl);

fputs($fp, "Content-Length: " . strlen($_POST['data']) . $nl);
fputs($fp, "Content-Type: application/json" . $nl);
fputs($fp, "Connection: close" . $nl);

if(!empty($_POST['sessionid'])) {
    fputs($fp, "Cookie: sessionid=" . $_POST['sessionid'] . $nl);
}

fputs($fp, $nl);
fputs($fp, $_POST['data']);

for($response=''; !feof($fp); $response.=fgets($fp, 128));

fclose($fp);

list($header, $content) = explode($nl . $nl, $response, 2);

$headers = array();
$header_lines = explode($nl, $header);

// FIXME
array_shift($header_lines);

foreach($header_lines as $line) {
    list($key, $val) = explode(":", $line);
    $headers[strtolower(trim($key))] = trim($val);
}

$sessionid = null;

if(isset($headers['set-cookie'])) {
    if(preg_match('/sessionid=([0-9a-f]+);/', $headers['set-cookie'], $matches)) {
        $sessionid = $matches[1];
    }
}

$json = json_decode($content);

if($sessionid != null) {
    $json->sessionid = $sessionid;
}

echo json_encode($json);
