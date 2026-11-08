# CM Servicios Electricidad

Sitio independiente ubicado en:

```txt
/srv/websites/cm-servicios
```

No comparte archivos ni aplicacion con `/srv/comodoro`.

## Vista previa

Nginx sirve el sitio en `http://76.13.250.180:3101/`.
El puerto 3101 ya esta ocupado por Nginx; para una vista previa temporal usar otro puerto.

Servidor temporal:

```bash
cd /srv/websites/cm-servicios
python3 -m http.server 3103 --bind 127.0.0.1
```

URL local:

```txt
http://127.0.0.1:3103/
```

## Dominio de produccion

Dominio: `cmservicioselectricos.com` y `www.cmservicioselectricos.com`.
Servidor: `76.13.250.180`. DNS apunta a la IP, no al puerto 3101.
Nginx: `/etc/nginx/sites-available/cmservicioselectricos.com`.
HTTPS activo en `https://cmservicioselectricos.com` y `https://www.cmservicioselectricos.com`.
Certificado de Let's Encrypt con renovacion automatica mediante Certbot.
Las visitas por HTTP se redirigen a HTTPS.

Para un dominio propio, lo mas limpio es que Nginx sirva esta carpeta como sitio estatico separado:

```nginx
server {
    listen 80;
    server_name ejemplo.com www.ejemplo.com;

    root /srv/websites/cm-servicios;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(css|js|svg|png|jpg|jpeg|webp|ico)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }
}
```

Reemplazar `ejemplo.com` por el dominio real.
