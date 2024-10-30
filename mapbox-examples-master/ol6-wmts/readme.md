server {
    listen       8006;
    server_name  localhost;
    location / {
        root   E:\mapbox\mapbox-examples;
        index  index.html index.htm;
    }
    location /mygeoserver/ {
        proxy_pass http://127.0.0.1:8081/;
    }
}