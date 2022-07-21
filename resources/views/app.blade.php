<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>To-Do</title>
    @vite('resources/js/App.css')
</head>
<body>
    <div id="root"></div>
    @viteReactRefresh
    @vite('resources/js/App.jsx')
</body>
</html>
