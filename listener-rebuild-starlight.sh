#!/bin/bash

LOG_FILE="/opt/images-docker/admin_portal/listener-build.log"
WATCH_DIR="/opt/images-docker/admin_portal/content/docs"
CONTENT_STARTLIGHT="/opt/images-docker/admin_portal/manual-portal-smarttmt-github/startlight/src/content/docs"
CONTENT_TINA_MODIFICADO="/opt/images-docker/admin_portal/content/docs"
DOCKER_CONTEXTO="/opt/images-docker/admin_portal/manual-portal-smarttmt-github/startlight"
DOCKER_CONTEXTO_COMPOSE="/opt/images-docker/admin_portal"
LOCK_FILE="/tmp/build_script.lock"
QUEUE_FILE="/tmp/build_queue.flag"
DEBOUNCE_SECONDS=10


run_build() {
    if [ -f "$LOCK_FILE" ]; then
        echo "$(date) Otro proceso ya está corriendo, se encola la petición" >> "$LOG_FILE"
        touch "$QUEUE_FILE"
        return
    fi

    touch "$LOCK_FILE"
    echo "$(date) Inicia proceso de build" >> "$LOG_FILE"

    # Copiar archivos
    cp -r "$CONTENT_TINA_MODIFICADO"/* "$CONTENT_STARTLIGHT"/ >> "$LOG_FILE" 2>&1

    cd "$DOCKER_CONTEXTO"
    docker build -t manual-portal-front --network=host . >> "$LOG_FILE" 2>&1

    cd "$DOCKER_CONTEXTO_COMPOSE"
    docker compose up -d --force-recreate manual-portal-front >> "$LOG_FILE" 2>&1

    echo "$(date) Rebuild completado y servicios reiniciados" >> "$LOG_FILE"
    rm -f "$LOCK_FILE"

    # se encolaron eventos ejecutar otro ciclo
    if [ -f "$QUEUE_FILE" ]; then
        echo "$(date) Procesando petición encolada..." >> "$LOG_FILE"
        rm -f "$QUEUE_FILE"
        run_build
    fi
}

# debounce para evitar builds innecesarios al instante
last_event_time=0

inotifywait -m -r -e create -e close_write -e delete "$WATCH_DIR" |
while read path action file; do
    now=$(date +%s)
    if (( now - last_event_time < DEBOUNCE_SECONDS )); then
        echo "$(date) Calculando el debounce...: $action - $file" >> "$LOG_FILE"
        continue
    fi
    last_event_time=$now

    echo "$(date) Evento detectado: $action - $file" >> "$LOG_FILE"
    run_build
done

