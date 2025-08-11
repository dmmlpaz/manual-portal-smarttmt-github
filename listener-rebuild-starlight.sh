#!/bin/bash

LOG_FILE="/opt/images-docker/admin_portal/listener-tina.log"
WATCH_DIR="/opt/images-docker/admin_portal/content/docs"
CONTENT_STARTLIGHT="/opt/images-docker/admin_portal/manual-portal-smarttmt-github/startlight/src/content/docs"
CONTENT_TINA_MODIFICADO="/opt/images-docker/admin_portal/content/docs"
DOCKER_CONTEXTO="/opt/images-docker/admin_portal/manual-portal-smarttmt-github/startlight"
DOCKER_CONTEXTO_COMPOSE="/opt/images-docker/admin_portal"

touch $LOG_FILE

inotifywait -m -r -e create -e close_write -e delete "$WATCH_DIR" |
while read path action file; do
    echo "$(date) Archivo modificado  Acción: $action - Archivo: $file" >>  "$LOG_FILE"
    
    # se copia el volumen modifaco del content
    cp -r "$CONTENT_TINA_MODIFICADO"/* "$CONTENT_STARTLIGHT"/ >> "$LOG_FILE" 2>&1
    
    # 2. Reconstruir la imagen Docker y reiniciar servicios
    cd "$DOCKER_CONTEXTO"
    ls -l "$DOCKER_CONTEXTO"  >> "$LOG_FILE" 2>&1
    docker build -t manual-portal-front  --network=host .  >> "$LOG_FILE" 2>&1   

    # restar el contendor
    cd "$DOCKER_CONTEXTO_COMPOSE"
    sudo docker compose down >> "$LOG_FILE" 2>&1
    sudo docker compose up -d >> "$LOG_FILE" 2>&1
    
    echo "$(date) Rebuild completado y servicios reiniciados" >> "$LOG_FILE"