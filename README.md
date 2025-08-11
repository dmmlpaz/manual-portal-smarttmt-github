# Comando para compilar imagen de tina
    sudo docker build -t manual-portal-cms-tina --network=host . 

# Nota de logica de funcionamiento de despliegue a produccion

    Se implementa la siguiente logica para llevar tina cms y startlight a produccion debido a que el framework de tina para produccion esta cohecionado a
    github , el servicio cloud de tina y el funcionamiento en self-hosted con next js con esta limitantes se genera la siguiente estrategis para desplegar en un ambiente propio sin tina cloud, sin github y con startlight de astro.

    Se implementa una logica donde tina cms funcionando con next js, sera el backend de tina con logica de self-hosted en modo dev o desarrollo para que la configuracion del contenido se escribe en volumen de docker, una vez un usuario haga un cambio en el contenido, se indentifica que el volumen tubo modificacion y por medio de la herramienta inotify-tools que detecta cambio en el file system en esta cado en el voumne de tina del contenido del cms de la ruta volumen -> - ./content:/app/content este dispara un .sh llamado listener-rebuild-starlight.sh que lo que hace es compiar el volumen modficado en el proyecto de starlight que es el cliente del manual en la ruta  src/content , depues de copiar el contenido modificado se hace el rebuil de la imagen del starlight y se realiza el redploy del del sistema de todos los contendores, con esta logica se realiza el despliegue a produccion y el cambio del contenido en caliente