# Despliegue del proyecto Koma Coffee

Este proyecto se puede desplegar localmente mediante Docker y exponer temporalmente a internet usando Cloudflare Tunnel.

## Servicios Docker

El proyecto se divide en los siguientes servicios:

- `frontend-react`: aplicación React compilada y servida con Nginx.
- `app-laravel`: backend Laravel ejecutado con PHP-FPM.
- `nginx-laravel`: servidor Nginx para Laravel.
- `db`: base de datos MariaDB.
- `nginx-proxy`: proxy inverso principal que unifica frontend y backend.

## Levantar el proyecto

Desde la raíz del proyecto:

```bash
docker compose up -d --build
```

## Preparar Laravel

Si es la primera vez que se levanta el entorno:

```bash
docker exec -it koma_app_laravel php artisan key:generate
docker exec -it koma_app_laravel php artisan migrate:fresh --seed
docker exec -it koma_app_laravel php artisan storage:link
```

## Acceso local

Frontend:

```txt
http://localhost:8088
```

API:

```txt
http://localhost:8088/api/books
```

## Exponer con Cloudflare Tunnel

Con Docker levantado, ejecutar:

```bash
cloudflared tunnel --url http://localhost:8088
```

Cloudflare generará una URL temporal del tipo:

```txt
https://nombre-aleatorio.trycloudflare.com
```

Esa URL permite acceder al proyecto desde internet sin abrir puertos del router.

## Orden para la presentación

1. Abrir Docker Desktop.
2. Levantar el proyecto:

```bash
docker compose up -d
```

3. Comprobar acceso local:

```txt
http://localhost:8088
```

4. Ejecutar el túnel:

```bash
cloudflared tunnel --url http://localhost:8088
```

5. Copiar la URL pública generada.
6. Probar:

```txt
https://url-generada.trycloudflare.com
https://url-generada.trycloudflare.com/api/books
```

## Parar el proyecto

```bash
docker compose down
```