# Dependecia del proyecto
    1. inotifywait es una herramienta de línea de comandos en Linux que permite a los usuarios monitorear cambios en el sistema de archivos.
        -- sudo apt install inotify-tools
    2. Starlight  es un tema de documentación completo construido sobre el framework Astro
        -- pnpm create astro --template starlight
    3. TinaCMS es un open source CMS headles con que soporta git
        -- npx create-tina-app@latest

# Comando para compilar imagen de tina
    sudo docker build -t manual-portal-cms-tina --network=host . 

# Nota de logica de funcionamiento de despliegue a produccion

Se implementa la siguiente lógica para llevar Tina CMS y Starlight a producción, debido a que el framework de Tina para entornos productivos está estrechamente integrado con GitHub, el servicio en la nube de Tina (Tina Cloud) y el funcionamiento en modo self-hosted con Next.js.

Dado estas limitaciones, se diseña la siguiente estrategia para desplegar en un ambiente propio, sin utilizar Tina Cloud, sin GitHub, y empleando Starlight (basado en Astro):

Se establece una lógica donde Tina CMS, funcionando con Next.js, actúa como backend en modo self-hosted en entorno de desarrollo (dev). La modificaciones del contenido se escribe directamente en un volumen de Docker.

Cuando un usuario realiza un cambio en el contenido, se detecta una modificación en el volumen. Para esto, se utiliza la herramienta inotify-tools, que monitorea cambios en el sistema de archivos. En este caso, monitorea el volumen del contenido del CMS, montado en la ruta:

```bash
    volumes:
      - ./content:/app/content
```

Cuando se detecta un cambio, se ejecuta un script .sh llamado listener-rebuild-starlight.sh. Este script copia el contenido modificado desde el volumen de Tina hacia el proyecto de Starlight, específicamente en la ruta src/content.

Después de copiar el nuevo contenido, se realiza un rebuild de la imagen de Starlight y se hace un redeploy de todo el sistema de contenedores.

Con esta lógica, se permite realizar un despliegue a producción, permitiendo además cambios de contenido en caliente (hot content updates), sin depender de Tina Cloud ni de GitHub.

# El symlink o enlace simbolico para desarrollo local se ejecuta desde el proyecto de tina la fuent de datos del contenido del sitio es startlight en la ruta /src/content/docs
  -- sudo ln -s /opt/reposmart/manual-portal-smarttmt-github/startlight/src/content/docs content