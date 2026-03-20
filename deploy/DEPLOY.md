# Deploy — guardianes.cercu.com.mx

Sigue el mismo patrón que `observatorio.cercu.com.mx`:
- Nuxt node-server + PM2 en puerto 3004
- Nginx reverse proxy con subdominio
- Proyecto en `/var/www/cercu-frontend/guardianes/`

## 1. DNS

Agregar registro A en tu proveedor de DNS:

```
Tipo: A
Nombre: guardianes
Valor: 72.62.200.124
```

## 2. Subir proyecto al servidor

```bash
# Desde tu máquina local
rsync -avz --exclude node_modules --exclude .nuxt --exclude .output --exclude .git \
  . root@72.62.200.124:/var/www/cercu-frontend/guardianes/
```

## 3. En el servidor (SSH)

```bash
ssh root@72.62.200.124

# Instalar dependencias y construir
cd /var/www/cercu-frontend/guardianes
npm install
npm run build

# Agregar a PM2 del ecosystem existente
# Opción A: agregar la entrada de guardianes al ecosystem.config.cjs existente
# Opción B: iniciar directamente:
pm2 start .output/server/index.mjs --name guardianes -- --port 3004
pm2 save
```

## 4. Configurar Nginx

Agregar el bloque del server a la config existente de cercu:

```bash
# Editar la config de nginx
nano /etc/nginx/sites-available/cercu

# Agregar el bloque de deploy/nginx.conf al final del archivo
# (server block para guardianes.cercu.com.mx → proxy_pass 127.0.0.1:3004)

# Verificar y recargar
nginx -t
systemctl reload nginx
```

## 5. SSL con certbot

```bash
certbot --nginx -d guardianes.cercu.com.mx
```

## 6. Verificar

```bash
curl -I https://guardianes.cercu.com.mx
pm2 status
```

## Actualizar (después del deploy inicial)

```bash
# Desde local
rsync -avz --exclude node_modules --exclude .nuxt --exclude .output --exclude .git \
  . root@72.62.200.124:/var/www/cercu-frontend/guardianes/

# En el servidor
ssh root@72.62.200.124
cd /var/www/cercu-frontend/guardianes
npm install
npm run build
pm2 restart guardianes
```

## Alternativa: agregar al deploy.sh de cercu

Agregar estos pasos al `deploy.sh` existente de cercu-frontend:

```bash
# ── Guardianes ──
echo "→ Actualizando guardianes..."
cd $FRONTEND_DIR/guardianes
npm install
npm run build
```

Y agregar la entrada de guardianes al `ecosystem.config.cjs` de cercu-frontend para que `pm2 reload ecosystem.config.cjs` lo incluya.
