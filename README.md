# Dependecias del proyecto
    1. inotifywait es una herramienta de línea de comandos en Linux que permite a los usuarios monitorear cambios en el sistema de archivos.
        -- sudo apt install inotify-tools
    2. Starlight  es un tema de documentación completo construido sobre el framework Astro
        -- pnpm create astro --template starlight
    3. TinaCMS es un open source CMS headles con que soporta git
        -- npx create-tina-app@latest


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


# Logica de creacion de contenido en desarrollo:

    1. La fuente del  contendio lo va a servir el proyecto de starlight desde el directorio startlight/src/content/docs y se deb de crear un 
    symlink o enlace simbolico para desarrollo en el proyecto de tina la fuente de datos del contenido del sitio es startlight en la ruta /src/content/docs
        -- sudo ln -s /opt/reposmart/manual-portal-smarttmt-github/startlight/src/content/docs content

    2. para desarrollo o crear contenido rapidamente ejecutar en cada proyecto el siguiente comando
        -- startlight pnpm dev
        -- tina pnpm dev
    
    3. Una vez creado el cotenido del sistema que esta en  startlight en ruta startlight/src/content/docs hace commit al repositorio de github y el de smart el github es obligatorio debido a que tina necesita para su funcionamiento una cuenta de github y en el de smart va hacer donde se guarde el contenido del sistema
   

# Comando para compilar imagen de tina y starlight
    
    -- sudo docker build -t manual-portal-cms-tina --network=host .
    -- sudo docker build -t manual-portal-front --network=host . 
